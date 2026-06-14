const Settings = require("../models/Settings");

const getSettings = async (req, res) => {
  try {
    const settings = await Settings.getSettings();
    res.json(settings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateSettings = async (req, res) => {
  try {
    let settings = await Settings.getSettings();
    const allowed = [
      "companyName", "companyDomain", "defaultLeaveBalance",
      "reimbursementBudgetMonthly", "emailDigestEnabled",
      "emailDigestDay", "allowCarryForward", "maxCarryForwardDays",
    ];
    allowed.forEach(key => {
      if (req.body[key] !== undefined) settings[key] = req.body[key];
    });
    await settings.save();
    res.json({ message: "Settings updated successfully.", settings });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getSettings, updateSettings };
