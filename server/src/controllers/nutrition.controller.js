const asyncHandler = require("../utils/asyncHandler");
const { estimateNutrition } = require("../services/nutritionEstimator.service");

const estimateFoodNutrition = asyncHandler(async (req, res) => {
  const estimate = await estimateNutrition({
    foodItem: req.body.foodItem,
    quantity: req.body.quantity,
  });

  res.json({ estimate });
});

module.exports = {
  estimateFoodNutrition,
};
