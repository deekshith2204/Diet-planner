const HealthProfile = require("../models/HealthProfile");
const asyncHandler = require("../utils/asyncHandler");
const { calculateHealthMetrics } = require("../utils/healthMetrics");

function publicProfile(profile) {
  return {
    id: profile.id,
    weightKg: profile.weightKg,
    heightCm: profile.heightCm,
    age: profile.age,
    gender: profile.gender,
    goal: profile.goal,
    activityLevel: profile.activityLevel,
    conditions: profile.conditions,
    dietaryPreference: profile.dietaryPreference,
    bmi: profile.bmi,
    targetCalories: profile.targetCalories,
    createdAt: profile.createdAt,
    updatedAt: profile.updatedAt,
  };
}

const getMyHealthProfile = asyncHandler(async (req, res) => {
  const profile = await HealthProfile.findOne({ userId: req.user.id });

  if (!profile) {
    return res.status(404).json({ message: "Health profile has not been created yet" });
  }

  return res.json({ profile: publicProfile(profile) });
});

const upsertMyHealthProfile = asyncHandler(async (req, res) => {
  const profileData = {
    weightKg: Number(req.body.weightKg),
    heightCm: Number(req.body.heightCm),
    age: Number(req.body.age),
    gender: req.body.gender,
    goal: req.body.goal,
    activityLevel: req.body.activityLevel,
    conditions: req.body.conditions || [],
    dietaryPreference: req.body.dietaryPreference,
  };
  const metrics = calculateHealthMetrics(profileData);

  const profile = await HealthProfile.findOneAndUpdate(
    { userId: req.user.id },
    {
      userId: req.user.id,
      ...profileData,
      ...metrics,
    },
    { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }
  );

  res.status(200).json({
    message: "Health profile saved",
    profile: publicProfile(profile),
  });
});

module.exports = {
  getMyHealthProfile,
  upsertMyHealthProfile,
};
