const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const {
  applyLeave,
  getMyLeaves,
  getAllLeaves,
  updateLeaveStatus,
} = require("../controllers/leaveController");

// Employee - Apply Leave
router.post(
  "/apply",
  protect,
  authorizeRoles("Employee"),
  applyLeave
);

// Employee - View Own Leaves
router.get(
  "/my-leaves",
  protect,
  authorizeRoles("Employee"),
  getMyLeaves
);

// Manager/Admin - View All Leaves
router.get(
  "/all",
  protect,
  authorizeRoles("Manager", "Admin"),
  getAllLeaves
);

// Manager/Admin - Approve/Reject Leave
router.put(
  "/:id/status",
  protect,
  authorizeRoles("Manager", "Admin"),
  updateLeaveStatus
);

module.exports = router;