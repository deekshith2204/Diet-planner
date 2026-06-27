const mongoose = require("mongoose");

const mealSchema = new mongoose.Schema(
  {
    mealType: { type: String, required: true },
    name: { type: String, required: true },
    ingredients: [{ type: String }],
    calories: { type: Number, required: true },
    proteinG: { type: Number, default: 0 },
    carbsG: { type: Number, default: 0 },
    fatG: { type: Number, default: 0 },
    keyNutrients: [{ type: String }],
    preparationTip: { type: String },
    recipe: {
      prepTimeMinutes: { type: Number, default: 10 },
      cookTimeMinutes: { type: Number, default: 15 },
      steps: [{ type: String }],
    },
  },
  { _id: false }
);

const supplementSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    purpose: { type: String, required: true },
    relatedConditions: [{ type: String }],
    caution: { type: String },
  },
  { _id: false }
);

const mealPlanSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    date: { type: Date, required: true },
    meals: [mealSchema],
    totalCalories: { type: Number, required: true },
    totalProteinG: { type: Number, default: 0 },
    totalCarbsG: { type: Number, default: 0 },
    totalFatG: { type: Number, default: 0 },
    foodsToAvoid: [{ type: String }],
    conditionTips: [{ type: String }],
    supplements: [supplementSchema],
    generatedBy: { type: String, enum: ["ai", "manual"], default: "ai" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("MealPlan", mealPlanSchema);
