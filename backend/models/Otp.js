const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema(
  {
    emailAddress: { type: String, required: true },
    otp: { type: String, required: true },
    purpose: { type: String, required: true }, // "register" | "agent-register"
    verified: { type: Boolean, default: false },
    expiresAt: { type: Date, required: true },
  },
  { collection: "otp_mst" }
);

module.exports = mongoose.model("Otp", otpSchema, "otp_mst");
