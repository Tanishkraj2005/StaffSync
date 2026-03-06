const Reimbursement = require("../models/Reimbursement");

exports.applyReimbursement = async (req, res) => {
  try {
    const { amount, description, expenseDate } = req.body;

    if (!amount || !description || !expenseDate) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const reimbursement = await Reimbursement.create({
      user: req.user._id,
      amount,
      description,
      expenseDate,
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

    const reimbursement = await Reimbursement.findById(req.params.id);

    if (!reimbursement) {
      return res.status(404).json({ message: "Not found" });
    }

    reimbursement.status = req.body.status;

    if (req.body.status === "Rejected") {
      reimbursement.rejectionReason = req.body.rejectionReason || "";
    } else {
      reimbursement.rejectionReason = "";
    }

    await reimbursement.save();

    res.status(200).json({ message: `Reimbursement ${status}`, reimbursement });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};