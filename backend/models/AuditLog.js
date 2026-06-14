const mongoose = require("mongoose");

const auditLogSchema = new mongoose.Schema(
  {
    action: { type: String, required: true },
    performedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    targetUser: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    details: { type: String },
    resourceType: { type: String },
    resourceId: { type: mongoose.Schema.Types.ObjectId },
  },
  { timestamps: true }
);

module.exports = mongoose.model("AuditLog", auditLogSchema);
