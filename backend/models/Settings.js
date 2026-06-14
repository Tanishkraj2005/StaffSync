const mongoose = require("mongoose");

const settingsSchema = new mongoose.Schema(
  {
    companyName: { type: String, default: "StaffSync" },
    companyDomain: { type: String, default: "" },
    defaultLeaveBalance: { type: Number, default: 20 },
    reimbursementBudgetMonthly: { type: Number, default: 10000 },
    emailDigestEnabled: { type: Boolean, default: true },
    emailDigestDay: { type: String, default: "Monday" },
    allowCarryForward: { type: Boolean, default: false },
    maxCarryForwardDays: { type: Number, default: 5 },
  },
  { timestamps: true }
);

settingsSchema.statics.getSettings = async function () {
  let settings = await this.findOne();
  if (!settings) settings = await this.create({});
  return settings;
};

module.exports = mongoose.model("Settings", settingsSchema);
