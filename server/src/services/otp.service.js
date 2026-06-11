const bcrypt = require("bcryptjs");
const OtpToken = require("../models/OtpToken");
const generateOtp = require("../utils/generateOtp");

const OTP_LIFETIME_MS = 5 * 60 * 1000;

async function createOtp({ userId, email, phone, purpose }) {
  await OtpToken.deleteMany({ userId, purpose });

  const otp = generateOtp();
  const otpHash = await bcrypt.hash(otp, 10);
  const record = await OtpToken.create({
    userId,
    email,
    phone,
    otpHash,
    purpose,
    expiresAt: new Date(Date.now() + OTP_LIFETIME_MS),
  });

  return { otp, record };
}

async function verifyOtp({ tokenId, userId, purpose, otp }) {
  const query = tokenId ? { _id: tokenId, purpose } : { userId, purpose };
  const record = await OtpToken.findOne(query);

  if (!record || record.expiresAt <= new Date()) {
    const error = new Error("OTP is invalid or has expired");
    error.statusCode = 400;
    throw error;
  }

  if (record.attempts >= record.maxAttempts) {
    await record.deleteOne();
    const error = new Error("Maximum OTP attempts exceeded. Request a new code.");
    error.statusCode = 429;
    throw error;
  }

  const matches = await bcrypt.compare(otp, record.otpHash);
  if (!matches) {
    record.attempts += 1;
    await record.save();
    const error = new Error("OTP is incorrect");
    error.statusCode = 400;
    throw error;
  }

  await record.deleteOne();
  return record;
}

module.exports = {
  createOtp,
  verifyOtp,
};
