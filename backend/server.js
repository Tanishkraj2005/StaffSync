const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");

// Load .env ONLY in development (local machine)
if (process.env.NODE_ENV !== "production") {
  dotenv.config();
}

connectDB();

const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
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
  res.status(500).json({ message: err.message });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});