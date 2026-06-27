const { body, query } = require("express-validator");

const progressValidation = [
  body("date").isISO8601().withMessage("Enter a valid date"),
  body("weightKg").isFloat({ min: 30, max: 300 }).withMessage("Weight must be between 30 and 300 kg"),
  body("energyLevel").optional().isInt({ min: 1, max: 5 }).withMessage("Energy level must be between 1 and 5"),
  body("notes").optional({ checkFalsy: true }).trim().isLength({ max: 500 }).withMessage("Notes must be 500 characters or fewer"),
];

const dateRangeValidation = [
  query("from").optional().isISO8601().withMessage("Enter a valid from date"),
  query("to").optional().isISO8601().withMessage("Enter a valid to date"),
];

module.exports = {
  progressValidation,
  dateRangeValidation,
};
