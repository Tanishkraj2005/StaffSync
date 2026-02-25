const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: function () {
        // Password required only if not Google user
        return this.provider === "local";
      },
      minlength: 6,
    },

    provider: {
      type: String,
      enum: ["local", "google"],
      default: "local",
    },

    role: {
      type: String,
      enum: ["Admin", "Manager", "Employee"],
      default: "Employee",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);