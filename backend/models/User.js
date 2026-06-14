const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, "Name is required"], trim: true },
    email: { type: String, required: [true, "Email is required"], unique: true, lowercase: true, trim: true },
    password: {
      type: String,
      required: function () { return this.provider === "local"; },
      minlength: 6,
    },
    provider: { type: String, enum: ["local", "google"], default: "local" },
    role: { type: String, enum: ["Admin", "Manager", "Employee"], default: "Employee" },
    leaveBalance: { type: Number, default: 20 },
    phone: { type: String, default: "" },
    department: { type: String, default: "" },
    bio: { type: String, default: "" },
    profilePicture: { type: String, default: "" },
    passwordResetToken: { type: String },
    passwordResetExpires: { type: Date },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);