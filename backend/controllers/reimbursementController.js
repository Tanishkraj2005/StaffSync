const Reimbursement = require("../models/Reimbursement");
const User = require("../models/User");
const sendMail = require("../config/mailer");
const path = require("path");
const AuditLog = require("../models/AuditLog");

exports.applyReimbursement = async (req, res) => {
  try {
    const { amount, description, expenseDate } = req.body;

    if (!amount || !description || !expenseDate) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const receiptUrl = req.file
      ? `/uploads/${req.file.filename}`
      : "";

    const reimbursement = await Reimbursement.create({
      user: req.user._id,
      amount,
      description,
      expenseDate,
      receiptUrl,
    });

    res.status(201).json({ message: "Reimbursement submitted successfully", reimbursement });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getMyReimbursements = async (req, res) => {
  try {
    const reimbursements = await Reimbursement.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json(reimbursements);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllReimbursements = async (req, res) => {
  try {
    const reimbursements = await Reimbursement.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 });
    res.status(200).json(reimbursements);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateReimbursementStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!["Approved", "Rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const reimbursement = await Reimbursement.findById(req.params.id).populate("user", "name email");

    if (!reimbursement) {
      return res.status(404).json({ message: "Not found" });
    }

    if (reimbursement.user._id.toString() === req.user._id.toString()) {
      return res.status(403).json({ message: "You cannot approve or reject your own reimbursement request." });
    }

    reimbursement.status = status;

    if (status === "Rejected") {
      reimbursement.rejectionReason = req.body.rejectionReason || "";
    } else {
      reimbursement.rejectionReason = "";
    }

    await reimbursement.save();

    sendMail({
      to: reimbursement.user.email,
      subject: `Your Reimbursement Request has been ${status} — StaffSync`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: auto; border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden;">
          <div style="background: linear-gradient(135deg, #7c3aed, #db2777); padding: 24px;">
            <h1 style="color: white; margin: 0; font-size: 22px;">StaffSync</h1>
          </div>
          <div style="padding: 28px;">
            <h2 style="color: #111827; margin-top: 0;">Reimbursement Request ${status}</h2>
            <p style="color: #6b7280;">Hi <strong>${reimbursement.user.name}</strong>,</p>
            <p style="color: #6b7280;">Your reimbursement request has been <strong style="color: ${status === "Approved" ? "#16a34a" : "#dc2626"}">${status}</strong>.</p>
            <table style="width: 100%; border-collapse: collapse; margin-top: 16px;">
              <tr style="background: #f9fafb;"><td style="padding: 8px 12px; color: #6b7280;">Amount</td><td style="padding: 8px 12px; font-weight: 600;">₹${reimbursement.amount}</td></tr>
              <tr><td style="padding: 8px 12px; color: #6b7280;">Description</td><td style="padding: 8px 12px; font-weight: 600;">${reimbursement.description}</td></tr>
              ${status === "Rejected" && reimbursement.rejectionReason ? `<tr style="background: #f9fafb;"><td style="padding: 8px 12px; color: #6b7280;">Reason</td><td style="padding: 8px 12px; color: #dc2626;">${reimbursement.rejectionReason}</td></tr>` : ""}
            </table>
            <p style="color: #9ca3af; margin-top: 24px; font-size: 13px;">This is an automated notification from StaffSync.</p>
          </div>
        </div>
      `,
    });

    await AuditLog.create({
      action: status === "Approved" ? "REIMBURSEMENT_APPROVED" : "REIMBURSEMENT_REJECTED",
      performedBy: req.user._id,
      targetUser: reimbursement.user._id,
      details: `Reimbursement of ₹${reimbursement.amount} for ${reimbursement.user.name} was ${status}`,
      resourceType: "Reimbursement",
      resourceId: reimbursement._id,
    });

    res.status(200).json({ message: `Reimbursement ${status}`, reimbursement });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};