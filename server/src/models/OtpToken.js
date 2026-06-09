const mongoose = require("mongoose");

const otpTokenSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    email: { type: String, lowercase: true, trim: true },
    phone: { type: String, trim: true },
    otpHash: { type: String, required: true },
    purpose: { type: String, enum: ["email_verification", "sms_login"], required: true },
    attempts: { type: Number, default: 0 },
    expiresAt: { type: Date, required: true, index: { expires: 0 } },
  },
  { timestamps: true }
);

module.exports = mongoose.model("OtpToken", otpTokenSchema);
