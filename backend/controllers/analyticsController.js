const User = require("../models/User");
const Leave = require("../models/Leave");
const Reimbursement = require("../models/Reimbursement");
const AuditLog = require("../models/AuditLog");

const getSummary = async (req, res) => {
  try {
    const [totalUsers, totalLeaves, totalReimbursements] = await Promise.all([
      User.countDocuments(),
      Leave.countDocuments(),
      Reimbursement.countDocuments(),
    ]);

    const [leaveApproved, leavePending, leaveRejected] = await Promise.all([
      Leave.countDocuments({ status: "Approved" }),
      Leave.countDocuments({ status: "Pending" }),
      Leave.countDocuments({ status: "Rejected" }),
    ]);

    const [rApproved, rPending, rRejected] = await Promise.all([
      Reimbursement.countDocuments({ status: "Approved" }),
      Reimbursement.countDocuments({ status: "Pending" }),
      Reimbursement.countDocuments({ status: "Rejected" }),
    ]);

    const reimbursementTotal = await Reimbursement.aggregate([
      { $match: { status: "Approved" } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);

    res.json({
      totalUsers,
      totalLeaves,
      totalReimbursements,
      leaves: { Approved: leaveApproved, Pending: leavePending, Rejected: leaveRejected },
      reimbursements: { Approved: rApproved, Pending: rPending, Rejected: rRejected },
      totalReimbursementAmount: reimbursementTotal[0]?.total || 0,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const leavesByMonth = async (req, res) => {
  try {
    const data = await Leave.aggregate([
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          count: { $sum: 1 },
          approved: { $sum: { $cond: [{ $eq: ["$status", "Approved"] }, 1, 0] } },
          pending: { $sum: { $cond: [{ $eq: ["$status", "Pending"] }, 1, 0] } },
          rejected: { $sum: { $cond: [{ $eq: ["$status", "Rejected"] }, 1, 0] } },
        },
      },
      { $sort: { "_id.year": -1, "_id.month": -1 } },
      { $limit: 12 },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]);

    const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    const result = data.map(d => ({
      month: months[d._id.month - 1],
      total: d.count,
      Approved: d.approved,
      Pending: d.pending,
      Rejected: d.rejected,
    }));

    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const leaveTypes = async (req, res) => {
  try {
    const data = await Leave.aggregate([
      { $group: { _id: "$leaveType", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);
    res.json(data.map(d => ({ name: d._id, value: d.count })));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const reimbursementByMonth = async (req, res) => {
  try {
    const data = await Reimbursement.aggregate([
      { $match: { status: "Approved" } },
      {
        $group: {
          _id: { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } },
          amount: { $sum: "$amount" },
          count: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": -1, "_id.month": -1 } },
      { $limit: 12 },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]);

    const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    res.json(data.map(d => ({
      month: months[d._id.month - 1],
      amount: d.amount,
      count: d.count,
    })));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const topLeaveTakers = async (req, res) => {
  try {
    const data = await Leave.aggregate([
      { $match: { status: "Approved" } },
      { $group: { _id: "$user", days: { $sum: { $ifNull: ["$daysRequested", 1] } } } },
      { $sort: { days: -1 } },
      { $limit: 5 },
      { $lookup: { from: "users", localField: "_id", foreignField: "_id", as: "user" } },
      { $unwind: "$user" },
      { $project: { name: "$user.name", email: "$user.email", days: 1 } },
    ]);
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getSummary, leavesByMonth, leaveTypes, reimbursementByMonth, topLeaveTakers };
