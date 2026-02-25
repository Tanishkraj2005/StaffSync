const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const {
  applyReimbursement,
  getMyReimbursements,
  getAllReimbursements,
  updateReimbursementStatus,
} = require("../controllers/reimbursementController");

// Employee apply
router.post(
  "/apply",
  protect,
  authorizeRoles("Employee"),
  applyReimbursement
);

// Employee view own
router.get(
  "/my",
  protect,
  authorizeRoles("Employee"),
  getMyReimbursements
);

// Manager/Admin view all
router.get(
  "/all",
  protect,
  authorizeRoles("Manager", "Admin"),
  getAllReimbursements
);

// Manager/Admin approve/reject
router.put(
  "/:id/status",
  protect,
  authorizeRoles("Manager", "Admin"),
  updateReimbursementStatus
);

module.exports = router;