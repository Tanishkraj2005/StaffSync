const Leave = require("../models/Leave");


// APPLY LEAVE (Employee)
exports.applyLeave = async (req, res) => {
  try {
    const { leaveType, fromDate, toDate, reason } = req.body;

    if (!leaveType || !fromDate || !toDate || !reason) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const leave = await Leave.create({
      user: req.user._id,
      leaveType,
      fromDate,
      toDate,
      reason,
    });

    res.status(201).json({
      message: "Leave applied successfully",
      leave,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// GET MY LEAVES (Employee)


exports.getMyLeaves = async (req, res) => {
  try {
    const leaves = await Leave.find({ user: req.user._id }).sort({
      createdAt: -1,
    });

    res.status(200).json(leaves);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// GET ALL LEAVES (Manager/Admin)

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

// UPDATE LEAVE STATUS
// (Manager/Admin)

exports.updateLeaveStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!["Approved", "Rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const leave = await Leave.findById(req.params.id);

    if (!leave) {
      return res.status(404).json({ message: "Leave not found" });
    }

    leave.status = req.body.status;

      if (req.body.status === "Rejected") {
        leave.rejectionReason = req.body.rejectionReason || "";
      } else {
        leave.rejectionReason = "";
      }

      await leave.save();

    res.status(200).json({
      message: `Leave ${status} successfully`,
      leave,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};