const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");
const upload = require("../middleware/uploadMiddleware");

const {
  applyReimbursement,
  getMyReimbursements,
  getAllReimbursements,
  updateReimbursementStatus,
} = require("../controllers/reimbursementController");

router.post(
  "/apply",
  protect,
  authorizeRoles("Employee", "Manager", "Admin"),
  upload.single("receipt"),
  applyReimbursement
);

router.get(
  "/my",
  protect,
  authorizeRoles("Employee", "Manager", "Admin"),
  getMyReimbursements
);

router.get(
  "/all",
  protect,
  authorizeRoles("Manager", "Admin"),
  getAllReimbursements
);

router.put(
  "/:id/status",
  protect,
  authorizeRoles("Manager", "Admin"),
  updateReimbursementStatus
);

module.exports = router;