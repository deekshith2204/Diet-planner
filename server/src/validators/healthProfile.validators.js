const { body } = require("express-validator");

const supportedConditions = [
  "acidity_gerd",
  "ibs",
  "type_2_diabetes",
  "high_cholesterol",
  "hypertension",
  "lactose_intolerance",
  "gluten_intolerance",
  "pcos",
  "thyroid_issues",
];

const healthProfileValidation = [
  body("weightKg").isFloat({ min: 30, max: 300 }).withMessage("Weight must be between 30 and 300 kg"),
  body("heightCm").isFloat({ min: 100, max: 250 }).withMessage("Height must be between 100 and 250 cm"),
  body("age").isInt({ min: 13, max: 100 }).withMessage("Age must be between 13 and 100"),
  body("gender").isIn(["female", "male", "other"]).withMessage("Choose a valid gender"),
  body("goal")
    .isIn(["weight_loss", "muscle_gain", "maintenance"])
    .withMessage("Choose a valid goal"),
  body("activityLevel")
    .isIn(["sedentary", "light", "moderate", "active"])
    .withMessage("Choose a valid activity level"),
  body("dietaryPreference")
    .isIn(["vegetarian", "non_vegetarian", "vegan"])
    .withMessage("Choose a valid dietary preference"),
  body("conditions").optional().isArray().withMessage("Conditions must be a list"),
  body("conditions.*").optional().isIn(supportedConditions).withMessage("Unsupported medical condition"),
];

module.exports = {
  healthProfileValidation,
  supportedConditions,
};
