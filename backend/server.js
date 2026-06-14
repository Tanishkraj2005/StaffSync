const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const cron = require("node-cron");
const rateLimit = require("express-rate-limit");
const nodemailer = require("nodemailer");
const connectDB = require("./config/db");

dotenv.config();
connectDB();

const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

const app = express();

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.get("/", (req, res) => res.send("StaffSync API Running"));

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { message: "Too many requests from this IP, please try again later." }
});
app.use("/api/auth", authLimiter);
app.use("/api/auth",            require("./routes/authRoutes"));
app.use("/api/auth",            require("./routes/passwordResetRoutes"));
app.use("/api/users",           require("./routes/userRoutes"));
app.use("/api/leaves",          require("./routes/leaveRoutes"));
app.use("/api/reimbursements",  require("./routes/reimbursementRoutes"));
app.use("/api/analytics",       require("./routes/analyticsRoutes"));
app.use("/api/settings",        require("./routes/settingsRoutes"));
app.use("/api/audit-logs",      require("./routes/auditLogRoutes"));

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: err.message });
});

cron.schedule("0 0 1 1 *", async () => {
  try {
    const User = require("./models/User");
    const Settings = require("./models/Settings");
    const settings = await Settings.getSettings();
    const defaultBalance = settings.defaultLeaveBalance || 20;

    const users = await User.find({});
    const carryForwardDays = settings.allowCarryForward ? settings.maxCarryForwardDays : 0;

    for (const user of users) {
      const carried = Math.min(user.leaveBalance, carryForwardDays);
      user.leaveBalance = defaultBalance + carried;
      await user.save();
    }
    console.log(`[CRON] ✅ Leave balances reset to ${defaultBalance} + carry-forward for ${users.length} users`);
  } catch (err) {
    console.error("[CRON] ❌ Leave balance reset failed:", err.message);
  }
}, { timezone: "Asia/Kolkata" });

cron.schedule("0 8 * * 1", async () => {
  try {
    const Settings = require("./models/Settings");
    const settings = await Settings.getSettings();
    if (!settings.emailDigestEnabled) return;
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) return;

    const Leave = require("./models/Leave");
    const User = require("./models/User");

    const managers = await User.find({ role: { $in: ["Manager", "Admin"] } });

    const pendingLeaves = await Leave.find({ status: "Pending" }).populate("user", "name email");
    const Reimbursement = require("./models/Reimbursement");
    const pendingReimburse = await Reimbursement.find({ status: "Pending" }).populate("user", "name email");

    if (pendingLeaves.length === 0 && pendingReimburse.length === 0) return;

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
    });

    for (const manager of managers) {
      const leaveRows = pendingLeaves.map(l =>
        `<tr><td style="padding:8px;border-bottom:1px solid #e5e7eb">${l.user?.name}</td><td style="padding:8px;border-bottom:1px solid #e5e7eb">${l.leaveType}</td><td style="padding:8px;border-bottom:1px solid #e5e7eb">${new Date(l.fromDate).toLocaleDateString("en-IN")}</td></tr>`
      ).join("");

      const reimburseRows = pendingReimburse.map(r =>
        `<tr><td style="padding:8px;border-bottom:1px solid #e5e7eb">${r.user?.name}</td><td style="padding:8px;border-bottom:1px solid #e5e7eb">₹${r.amount}</td><td style="padding:8px;border-bottom:1px solid #e5e7eb">${r.description?.substring(0, 40)}</td></tr>`
      ).join("");

      await transporter.sendMail({
        from: `"StaffSync" <${process.env.EMAIL_USER}>`,
        to: manager.email,
        subject: `📊 Weekly Digest — ${pendingLeaves.length + pendingReimburse.length} Pending Actions`,
        html: `
          <div style="font-family:Inter,sans-serif;max-width:600px;margin:0 auto;padding:32px;background:#f8f9ff;border-radius:16px;">
            <h2 style="color:#4f46e5;margin-bottom:4px;">Weekly Summary</h2>
            <p style="color:#6b7280;margin-bottom:24px;">Hi ${manager.name}, here are the pending requests awaiting your action.</p>

            ${pendingLeaves.length > 0 ? `
            <h3 style="color:#374151;margin-bottom:8px;">📅 Pending Leave Requests (${pendingLeaves.length})</h3>
            <table style="width:100%;border-collapse:collapse;margin-bottom:24px;background:white;border-radius:8px;overflow:hidden;">
              <thead><tr style="background:#eef2ff"><th style="padding:10px;text-align:left">Employee</th><th style="padding:10px;text-align:left">Type</th><th style="padding:10px;text-align:left">From</th></tr></thead>
              <tbody>${leaveRows}</tbody>
            </table>` : ""}

            ${pendingReimburse.length > 0 ? `
            <h3 style="color:#374151;margin-bottom:8px;">💳 Pending Reimbursements (${pendingReimburse.length})</h3>
            <table style="width:100%;border-collapse:collapse;background:white;border-radius:8px;overflow:hidden;">
              <thead><tr style="background:#f3e8ff"><th style="padding:10px;text-align:left">Employee</th><th style="padding:10px;text-align:left">Amount</th><th style="padding:10px;text-align:left">Description</th></tr></thead>
              <tbody>${reimburseRows}</tbody>
            </table>` : ""}

            <p style="margin-top:24px;color:#9ca3af;font-size:12px;">This is an automated weekly digest from StaffSync.</p>
          </div>
        `,
      });
    }
    console.log(`[CRON] ✅ Weekly digest sent to ${managers.length} managers`);
  } catch (err) {
    console.error("[CRON] ❌ Weekly digest failed:", err.message);
  }
}, { timezone: "Asia/Kolkata" });

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 StaffSync API running on port ${PORT}`));
module.exports = app;
