const { body } = require("express-validator");

const emailRule = body("email")
  .isEmail()
  .withMessage("Enter a valid email address")
  .normalizeEmail();

const passwordRule = body("password")
  .isLength({ min: 8, max: 72 })
  .withMessage("Password must be between 8 and 72 characters")
  .matches(/[a-z]/)
  .withMessage("Password must contain a lowercase letter")
  .matches(/[A-Z]/)
  .withMessage("Password must contain an uppercase letter")
  .matches(/\d/)
  .withMessage("Password must contain a number");

const otpRule = body("otp")
  .matches(/^\d{6}$/)
  .withMessage("OTP must contain exactly 6 digits");

module.exports = {
  registerValidation: [
    body("name").trim().isLength({ min: 2, max: 80 }).withMessage("Name must be 2 to 80 characters"),
    emailRule,
    passwordRule,
    body("phone")
      .optional({ checkFalsy: true })
      .isMobilePhone("any")
      .withMessage("Enter a valid phone number"),
  ],
  verifyEmailValidation: [emailRule, otpRule],
  resendEmailOtpValidation: [emailRule],
  loginValidation: [emailRule, body("password").notEmpty().withMessage("Password is required")],
  verifySmsValidation: [
    body("challengeId").isMongoId().withMessage("Invalid SMS challenge"),
    otpRule,
  ],
};
