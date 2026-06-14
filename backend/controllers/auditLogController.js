const AuditLog = require("../models/AuditLog");

const getLogs = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 30;
    const logs = await AuditLog.find()
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate("performedBy", "name email role")
      .populate("targetUser", "name email");
    const total = await AuditLog.countDocuments();
    res.json({ logs, total, pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getLogs };
