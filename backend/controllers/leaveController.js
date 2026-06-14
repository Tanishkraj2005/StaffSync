const Leave = require("../models/Leave");
const User = require("../models/User");
const sendMail = require("../config/mailer");
const AuditLog = require("../models/AuditLog");

exports.applyLeave = async (req, res) => {
  try {
    const { leaveType, fromDate, toDate, reason } = req.body;

    if (!leaveType || !fromDate || !toDate || !reason) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const from = new Date(fromDate);
    const to = new Date(toDate);
    if (to < from) {
      return res.status(400).json({ message: "To date must be after from date" });
    }
    const msPerDay = 1000 * 60 * 60 * 24;
    const daysRequested = Math.ceil((to - from) / msPerDay) + 1;

    const user = await User.findById(req.user._id);
    if (user.leaveBalance < daysRequested) {
      return res.status(400).json({
        message: `Insufficient leave balance. You have ${user.leaveBalance} day(s) left but requested ${daysRequested}.`,
      });
    }

    const requiresAdminApproval = req.user.role === "Manager";

    const leave = await Leave.create({
      user: req.user._id,
      leaveType,
      fromDate,
      toDate,
      reason,
      daysRequested,
      requiresAdminApproval,
    });

    const roleMsg = requiresAdminApproval
      ? "Your leave request has been submitted and will be reviewed by an Admin."
      : "Leave applied successfully";

    res.status(201).json({ message: roleMsg, leave });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getMyLeaves = async (req, res) => {
  try {
    const leaves = await Leave.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json(leaves);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllLeaves = async (req, res) => {
  try {
    const leaves = await Leave.find()
      .populate("user", "name email role")
      .sort({ createdAt: -1 });
    res.status(200).json(leaves);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateLeaveStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!["Approved", "Rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const leave = await Leave.findById(req.params.id).populate("user", "name email leaveBalance role");

    if (!leave) {
      return res.status(404).json({ message: "Leave not found" });
    }

    if (leave.user._id.toString() === req.user._id.toString()) {
      return res.status(403).json({ message: "You cannot approve or reject your own leave request." });
    }

    if (leave.requiresAdminApproval && req.user.role !== "Admin") {
      return res.status(403).json({ message: "Only an Admin can approve or reject a Manager's leave request." });
    }

    const previousStatus = leave.status;

    leave.status = status;

    if (status === "Rejected") {
      leave.rejectionReason = req.body.rejectionReason || "";

      if (previousStatus === "Approved") {
        await User.findByIdAndUpdate(leave.user._id, {
          $inc: { leaveBalance: leave.daysRequested || 0 },
        });
      }
    } else if (status === "Approved") {
      leave.rejectionReason = "";

      if (previousStatus !== "Approved") {

        const freshUser = await User.findById(leave.user._id);
        if (freshUser.leaveBalance < (leave.daysRequested || 0)) {
          return res.status(400).json({
            message: `Cannot approve: insufficient balance. ${leave.user.name} has ${freshUser.leaveBalance} day(s) but this leave requires ${leave.daysRequested}.`,
          });
        }
        await User.findByIdAndUpdate(leave.user._id, {
          $inc: { leaveBalance: -(leave.daysRequested || 0) },
        });
      }
    }

    await leave.save();

    sendMail({
      to: leave.user.email,
      subject: `Your Leave Request has been ${status} — StaffSync`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: auto; border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden;">
          <div style="background: linear-gradient(135deg, #4f46e5, #7c3aed); padding: 24px;">
            <h1 style="color: white; margin: 0; font-size: 22px;">StaffSync</h1>
          </div>
          <div style="padding: 28px;">
            <h2 style="color: #111827; margin-top: 0;">Leave Request ${status}</h2>
            <p style="color: #6b7280;">Hi <strong>${leave.user.name}</strong>,</p>
            <p style="color: #6b7280;">Your leave request has been <strong style="color: ${status === "Approved" ? "#16a34a" : "#dc2626"}">${status}</strong>.</p>
            <table style="width: 100%; border-collapse: collapse; margin-top: 16px;">
              <tr style="background: #f9fafb;"><td style="padding: 8px 12px; color: #6b7280;">Type</td><td style="padding: 8px 12px; font-weight: 600;">${leave.leaveType}</td></tr>
              <tr><td style="padding: 8px 12px; color: #6b7280;">From</td><td style="padding: 8px 12px; font-weight: 600;">${new Date(leave.fromDate).toDateString()}</td></tr>
              <tr style="background: #f9fafb;"><td style="padding: 8px 12px; color: #6b7280;">To</td><td style="padding: 8px 12px; font-weight: 600;">${new Date(leave.toDate).toDateString()}</td></tr>
              ${status === "Rejected" && leave.rejectionReason ? `<tr><td style="padding: 8px 12px; color: #6b7280;">Reason</td><td style="padding: 8px 12px; color: #dc2626;">${leave.rejectionReason}</td></tr>` : ""}
            </table>
            <p style="color: #9ca3af; margin-top: 24px; font-size: 13px;">This is an automated notification from StaffSync.</p>
          </div>
        </div>
      `,
    });

    await AuditLog.create({
      action: status === "Approved" ? "LEAVE_APPROVED" : "LEAVE_REJECTED",
      performedBy: req.user._id,
      targetUser: leave.user._id,
      details: `${leave.leaveType} leave from ${new Date(leave.fromDate).toDateString()} for ${leave.user.name} was ${status}`,
      resourceType: "Leave",
      resourceId: leave._id,
    });

    res.status(200).json({ message: `Leave ${status} successfully`, leave });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};