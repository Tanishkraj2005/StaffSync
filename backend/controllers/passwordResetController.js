const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const User = require("../models/User");

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "No account found with that email." });
    if (user.provider === "google")
      return res.status(400).json({ message: "This account uses Google sign-in. Password reset is not available." });

    const token = crypto.randomBytes(32).toString("hex");
    user.passwordResetToken = crypto.createHash("sha256").update(token).digest("hex");
    user.passwordResetExpires = Date.now() + 60 * 60 * 1000;
    await user.save();

    const resetUrl = `${process.env.FRONTEND_URL || "http://localhost:5173"}/reset-password/${token}`;

    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
      });
      await transporter.sendMail({
        from: `"StaffSync" <${process.env.EMAIL_USER}>`,
        to: user.email,
        subject: "Password Reset Request — StaffSync",
        html: `
          <div style="font-family:Inter,sans-serif;max-width:520px;margin:0 auto;padding:32px;background:#f8f9ff;border-radius:16px;">
            <h2 style="color:#4f46e5;margin-bottom:8px;">Password Reset</h2>
            <p style="color:#374151;">Hi ${user.name},</p>
            <p style="color:#374151;">You requested a password reset for your StaffSync account.</p>
            <a href="${resetUrl}" style="display:inline-block;margin:20px 0;padding:14px 28px;background:linear-gradient(135deg,#4f46e5,#7c3aed);color:#fff;text-decoration:none;border-radius:12px;font-weight:700;">
              Reset Password
            </a>
            <p style="color:#6b7280;font-size:13px;">This link expires in <strong>1 hour</strong>. If you didn't request this, you can safely ignore this email.</p>
          </div>
        `,
      });
    }

    res.json({ message: "Password reset link sent to your email." });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const resetPassword = async (req, res) => {
  try {
    const hashedToken = crypto.createHash("sha256").update(req.params.token).digest("hex");
    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() },
    });
    if (!user) return res.status(400).json({ message: "Token is invalid or has expired." });

    if (!req.body.password || req.body.password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters long." });
    }

    user.password = await bcrypt.hash(req.body.password, 10);
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    res.json({ message: "Password reset successful. You can now sign in." });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { forgotPassword, resetPassword };
