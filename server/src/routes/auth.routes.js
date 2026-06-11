const router = require("express").Router();
const {
  register,
  verifyEmail,
  resendEmailOtp,
  login,
  verifySmsLogin,
  getMe,
} = require("../controllers/auth.controller");
const { protect } = require("../middleware/auth");
const otpRateLimiter = require("../middleware/otpRateLimiter");
const validateRequest = require("../middleware/validateRequest");
const {
  registerValidation,
  verifyEmailValidation,
  resendEmailOtpValidation,
  loginValidation,
  verifySmsValidation,
} = require("../validators/auth.validators");

router.post("/register", otpRateLimiter, registerValidation, validateRequest, register);
router.post("/verify-email", otpRateLimiter, verifyEmailValidation, validateRequest, verifyEmail);
router.post(
  "/resend-email-otp",
  otpRateLimiter,
  resendEmailOtpValidation,
  validateRequest,
  resendEmailOtp
);
router.post("/login", loginValidation, validateRequest, login);
router.post("/verify-sms", otpRateLimiter, verifySmsValidation, validateRequest, verifySmsLogin);
router.get("/me", protect, getMe);

module.exports = router;
