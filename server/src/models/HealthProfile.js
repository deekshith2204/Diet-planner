const mongoose = require("mongoose");

const healthProfileSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    weightKg: { type: Number, required: true },
    heightCm: { type: Number, required: true },
    age: { type: Number, required: true },
    gender: { type: String, enum: ["female", "male", "other"], required: true },
    goal: { type: String, enum: ["weight_loss", "muscle_gain", "maintenance"], required: true },
    activityLevel: {
      type: String,
      enum: ["sedentary", "light", "moderate", "active"],
      default: "light",
    },
    conditions: [{ type: String, trim: true }],
    dietaryPreference: {
      type: String,
      enum: ["vegetarian", "non_vegetarian", "vegan"],
      required: true,
    },
    bmi: { type: Number },
    targetCalories: { type: Number },
  },
  { timestamps: true }
);

module.exports = mongoose.model("HealthProfile", healthProfileSchema);
