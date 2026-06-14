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
router.post(
  "/apply",
  protect,
  authorizeRoles("Employee", "Manager", "Admin"),
  applyLeave
);
router.get(
  "/my-leaves",
  protect,
  authorizeRoles("Employee", "Manager", "Admin"),
  getMyLeaves
);
router.get(
  "/all",
  protect,
  authorizeRoles("Manager", "Admin"),
  getAllLeaves
);
router.put(
  "/:id/status",
  protect,
  authorizeRoles("Manager", "Admin"),
  updateLeaveStatus
);

module.exports = router;