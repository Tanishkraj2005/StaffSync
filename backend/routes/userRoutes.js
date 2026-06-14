const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");
const { getAllUsers, updateUserRole, updateProfile, updateLeaveBalance } = require("../controllers/userController");
router.get("/all",     protect, authorizeRoles("Admin"), getAllUsers);
router.put("/:id/role", protect, authorizeRoles("Admin"), updateUserRole);
router.put("/:id/leave-balance", protect, authorizeRoles("Admin"), updateLeaveBalance);
router.get("/profile", protect, (req, res) => res.json(req.user));
router.put("/profile", protect, updateProfile);

module.exports = router;