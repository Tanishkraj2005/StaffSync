const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");

// Always load .env (Vercel uses its own env vars system, local uses .env file)
dotenv.config();

connectDB();

const app = express();

// Allow multiple origins: local dev + your Vercel frontend URL
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

app.use(express.json());

// Default Route
app.get("/", (req, res) => {
  res.send("Employee Leave Management API Running");
});

// AUTH ROUTES
app.use("/api/auth", require("./routes/authRoutes"));

// USER ROUTES
app.use("/api/users", require("./routes/userRoutes"));

// LEAVE ROUTES
app.use("/api/leaves", require("./routes/leaveRoutes"));

// REIMBURSEMENT ROUTES
app.use("/api/reimbursements", require("./routes/reimbursementRoutes"));

// GLOBAL ERROR HANDLER
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: err.message });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;