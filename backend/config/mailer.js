const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendMail = async ({ to, subject, html }) => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.warn("[Mailer] EMAIL_USER or EMAIL_PASS not set — skipping email.");
    return;
  }
  try {
    await transporter.sendMail({
      from: `"StaffSync" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });
    console.log(`[Mailer] Email sent to ${to}`);
  } catch (err) {
    console.error("[Mailer] Failed to send email:", err.message);
  }
};

module.exports = sendMail;
