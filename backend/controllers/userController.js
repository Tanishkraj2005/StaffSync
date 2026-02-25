const User = require("../models/User");


// GET ALL USERS



exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// UPDATE USER ROLE



exports.updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;

    if (!["Employee", "Manager"].includes(role)) {
      return res.status(400).json({
        message: "Invalid role change",
      });
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    if (user.role === "Admin") {
      return res.status(403).json({
        message: "Cannot modify Admin role",
      });
    }

    user.role = role;
    await user.save();

    res.status(200).json({
      message: "Role updated successfully",
      user,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};