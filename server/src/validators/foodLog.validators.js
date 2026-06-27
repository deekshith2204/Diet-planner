const { body, query } = require("express-validator");

const mealTypes = ["breakfast", "snack_1", "lunch", "snack_2", "dinner", "other"];

const foodLogValidation = [
  body("date").isISO8601().withMessage("Enter a valid date"),
  body("foodItem").trim().isLength({ min: 2, max: 120 }).withMessage("Food item must be 2 to 120 characters"),
  body("calories").isFloat({ min: 0, max: 5000 }).withMessage("Calories must be between 0 and 5000"),
  body("proteinG").optional().isFloat({ min: 0, max: 500 }).withMessage("Protein must be between 0 and 500g"),
  body("carbsG").optional().isFloat({ min: 0, max: 800 }).withMessage("Carbs must be between 0 and 800g"),
  body("fatG").optional().isFloat({ min: 0, max: 500 }).withMessage("Fat must be between 0 and 500g"),
  body("mealType").isIn(mealTypes).withMessage("Choose a valid meal type"),
  body("notes").optional({ checkFalsy: true }).trim().isLength({ max: 500 }).withMessage("Notes must be 500 characters or fewer"),
];

const dateRangeValidation = [
  query("from").optional().isISO8601().withMessage("Enter a valid from date"),
  query("to").optional().isISO8601().withMessage("Enter a valid to date"),
];

module.exports = {
  foodLogValidation,
  dateRangeValidation,
};
