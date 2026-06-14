const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");
const { getLogs } = require("../controllers/auditLogController");

router.get("/", protect, authorizeRoles("Admin"), getLogs);

module.exports = router;
