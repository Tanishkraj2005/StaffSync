const User = require("../models/User");
const AuditLog = require("../models/AuditLog");

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;

    if (!["Employee", "Manager"].includes(role)) {
      return res.status(400).json({ message: "Invalid role change" });
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.role === "Admin") {
      return res.status(403).json({ message: "Cannot modify Admin role" });
    }

    const oldRole = user.role;
    user.role = role;
    await user.save();

    await AuditLog.create({
      action: "ROLE_UPDATED",
      performedBy: req.user._id,
      targetUser: user._id,
      details: `Role changed from ${oldRole} to ${role} for ${user.name}`,
      resourceType: "User",
      resourceId: user._id,
    });

    res.status(200).json({ message: "Role updated successfully", user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { name, phone, department, bio } = req.body;
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });
    if (name) user.name = name;
    if (phone !== undefined) user.phone = phone;
    if (department !== undefined) user.department = department;
    if (bio !== undefined) user.bio = bio;
    await user.save();
    res.json({ message: "Profile updated", user: { name: user.name, email: user.email, phone: user.phone, department: user.department, bio: user.bio, role: user.role, leaveBalance: user.leaveBalance } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateLeaveBalance = async (req, res) => {
  try {
    const { leaveBalance } = req.body;
    let parsedBalance = Number(leaveBalance);
    if (isNaN(parsedBalance) || parsedBalance < 0 || parsedBalance > 365) {
      return res.status(400).json({ message: "Invalid leave balance" });
    }
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    user.leaveBalance = parsedBalance;
    await user.save();
    res.json({ message: "Leave balance updated", leaveBalance: user.leaveBalance });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};