const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const {
  getAllUsers,
  updateUserRole,
} = require("../controllers/userController");

// Admin only - get all users
router.get(
  "/all",
  protect,
  authorizeRoles("Admin"),
  getAllUsers
);

// Admin only - update role
router.put(
  "/:id/role",
  protect,
  authorizeRoles("Admin"),
  updateUserRole
);

// Get own profile
router.get("/profile", protect, (req, res) => {
  res.json(req.user);
});

module.exports = router;