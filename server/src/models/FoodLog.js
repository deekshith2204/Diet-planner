const mongoose = require("mongoose");

const foodLogSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    date: { type: Date, required: true },
    foodItem: { type: String, required: true, trim: true },
    calories: { type: Number, required: true },
    proteinG: { type: Number, default: 0 },
    carbsG: { type: Number, default: 0 },
    fatG: { type: Number, default: 0 },
    mealType: { type: String, required: true },
    notes: { type: String, trim: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("FoodLog", foodLogSchema);
