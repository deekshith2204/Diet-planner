const router = require("express").Router();
const { body } = require("express-validator");
const { estimateFoodNutrition } = require("../controllers/nutrition.controller");
const { protect } = require("../middleware/auth");
const validateRequest = require("../middleware/validateRequest");

router.use(protect);

router.post(
  "/estimate",
  [
    body("foodItem").trim().isLength({ min: 2, max: 300 }).withMessage("Enter the food items"),
    body("quantity").trim().isLength({ min: 1, max: 80 }).withMessage("Enter a quantity, e.g. 100g or 1 bowl"),
  ],
  validateRequest,
  estimateFoodNutrition
);

module.exports = router;
