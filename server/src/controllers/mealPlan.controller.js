const HealthProfile = require("../models/HealthProfile");
const MealPlan = require("../models/MealPlan");
const { generateAiMealPlan } = require("../services/openaiMealPlan.service");
const asyncHandler = require("../utils/asyncHandler");

function startOfToday() {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  return date;
}

function totals(meals) {
  return meals.reduce(
    (total, meal) => ({
      totalCalories: total.totalCalories + meal.calories,
      totalProteinG: total.totalProteinG + meal.proteinG,
      totalCarbsG: total.totalCarbsG + meal.carbsG,
      totalFatG: total.totalFatG + meal.fatG,
    }),
    { totalCalories: 0, totalProteinG: 0, totalCarbsG: 0, totalFatG: 0 }
  );
}

function publicMealPlan(plan) {
  return {
    id: plan.id,
    date: plan.date,
    meals: plan.meals,
    totalCalories: plan.totalCalories,
    totalProteinG: plan.totalProteinG,
    totalCarbsG: plan.totalCarbsG,
    totalFatG: plan.totalFatG,
    foodsToAvoid: plan.foodsToAvoid,
    conditionTips: plan.conditionTips,
    generatedBy: plan.generatedBy,
  };
}

const getTodayMealPlan = asyncHandler(async (req, res) => {
  const plan = await MealPlan.findOne({ userId: req.user.id, date: startOfToday() });

  if (!plan) {
    return res.status(404).json({ message: "No meal plan generated for today" });
  }

  return res.json({ mealPlan: publicMealPlan(plan) });
});

const generateMealPlan = asyncHandler(async (req, res) => {
  const profile = await HealthProfile.findOne({ userId: req.user.id });

  if (!profile) {
    return res.status(400).json({ message: "Create your health profile before generating a meal plan" });
  }

  const generatedPlan = await generateAiMealPlan(profile);
  const macroTotals = totals(generatedPlan.meals);
  const plan = await MealPlan.findOneAndUpdate(
    { userId: req.user.id, date: startOfToday() },
    {
      userId: req.user.id,
      date: startOfToday(),
      meals: generatedPlan.meals,
      ...macroTotals,
      foodsToAvoid: generatedPlan.foodsToAvoid,
      conditionTips: generatedPlan.conditionTips,
      generatedBy: generatedPlan.generatedBy,
    },
    { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }
  );

  return res.status(201).json({
    message: "Meal plan generated",
    mealPlan: publicMealPlan(plan),
  });
});

module.exports = {
  getTodayMealPlan,
  generateMealPlan,
};
