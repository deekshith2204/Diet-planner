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
    preparationTip: { type: String },
  },
  { _id: false }
);

const mealPlanSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    date: { type: Date, required: true },
    meals: [mealSchema],
    totalCalories: { type: Number, required: true },
    generatedBy: { type: String, enum: ["ai", "manual"], default: "ai" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("MealPlan", mealPlanSchema);
