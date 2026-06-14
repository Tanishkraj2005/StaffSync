const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");
const { getSummary, leavesByMonth, leaveTypes, reimbursementByMonth, topLeaveTakers } = require("../controllers/analyticsController");

router.use(protect, authorizeRoles("Admin", "Manager"));

router.get("/summary",              getSummary);
router.get("/leaves-by-month",      leavesByMonth);
router.get("/leave-types",          leaveTypes);
router.get("/reimbursement-by-month", reimbursementByMonth);
router.get("/top-leave-takers",     topLeaveTakers);

module.exports = router;
