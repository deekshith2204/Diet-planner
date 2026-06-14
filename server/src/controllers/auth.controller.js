const User = require("../models/User");
const { createOtp, verifyOtp } = require("../services/otp.service");
const { sendEmailOtp } = require("../services/email.service");
const { sendSmsOtp } = require("../services/sms.service");
const asyncHandler = require("../utils/asyncHandler");
const generateToken = require("../utils/generateToken");

function publicUser(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: user.role,
    isEmailVerified: user.isEmailVerified,
    isSms2FAEnabled: user.isSms2FAEnabled,
  };
}

const register = asyncHandler(async (req, res) => {
  const { name, email, password, phone } = req.body;
  const existingUser = await User.findOne({ email });

  if (existingUser?.isEmailVerified) {
    res.status(409);
    throw new Error("An account with this email already exists");
  }

  if (existingUser) {
    existingUser.name = name;
    existingUser.password = password;
    existingUser.phone = phone || existingUser.phone;
    await existingUser.save();
  }

  const user =
    existingUser ||
    (await User.create({
      name,
      email,
      password,
      phone,
    }));

  const { otp } = await createOtp({
    userId: user.id,
    email: user.email,
    purpose: "email_verification",
  });
  const emailDelivery = await sendEmailOtp({ email: user.email, name: user.name, otp });

  res.status(201).json({
    message: emailDelivery.delivered
      ? "Registration started. Check your email for the verification code."
      : "Registration started. Email delivery failed, so the OTP was printed in the backend terminal.",
    email: user.email,
  });
});

const verifyEmail = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    res.status(404);
    throw new Error("Registration was not found");
  }

  if (user.isEmailVerified) {
    res.status(409);
    throw new Error("Email is already verified");
  }

  await verifyOtp({
    userId: user.id,
    purpose: "email_verification",
    otp,
  });

  user.isEmailVerified = true;
  await user.save();

  res.json({
    message: "Email verified successfully",
    token: generateToken(user),
    user: publicUser(user),
  });
});

const resendEmailOtp = asyncHandler(async (req, res) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user || user.isEmailVerified) {
    res.status(400);
    throw new Error("No pending email verification was found");
  }

  const { otp } = await createOtp({
    userId: user.id,
    email: user.email,
    purpose: "email_verification",
  });
  const emailDelivery = await sendEmailOtp({ email: user.email, name: user.name, otp });

  res.json({
    message: emailDelivery.delivered
      ? "A new verification code has been sent"
      : "Email delivery failed, so the new OTP was printed in the backend terminal.",
  });
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.comparePassword(password))) {
    res.status(401);
    throw new Error("Email or password is incorrect");
  }

  if (!user.isEmailVerified) {
    res.status(403);
    throw new Error("Verify your email before logging in");
  }

  if (user.isSms2FAEnabled) {
    if (!user.phone) {
      res.status(400);
      throw new Error("SMS 2FA is enabled but no phone number is configured");
    }

    const { otp, record } = await createOtp({
      userId: user.id,
      phone: user.phone,
      purpose: "sms_login",
    });
    await sendSmsOtp({ phone: user.phone, otp });

    return res.json({
      requiresSmsOtp: true,
      challengeId: record.id,
      message: "Enter the verification code sent to your phone",
    });
  }

  return res.json({
    token: generateToken(user),
    user: publicUser(user),
  });
});

const verifySmsLogin = asyncHandler(async (req, res) => {
  const { challengeId, otp } = req.body;
  const record = await verifyOtp({
    tokenId: challengeId,
    purpose: "sms_login",
    otp,
  });
  const user = await User.findById(record.userId);

  if (!user) {
    res.status(404);
    throw new Error("User was not found");
  }

  res.json({
    token: generateToken(user),
    user: publicUser(user),
  });
});

const getMe = asyncHandler(async (req, res) => {
  res.json({ user: publicUser(req.user) });
});

module.exports = {
  register,
  verifyEmail,
  resendEmailOtp,
  login,
  verifySmsLogin,
  getMe,
};
