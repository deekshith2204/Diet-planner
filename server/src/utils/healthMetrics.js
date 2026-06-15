function calculateBmi(weightKg, heightCm) {
  const heightM = heightCm / 100;
  return Number((weightKg / (heightM * heightM)).toFixed(1));
}

function activityMultiplier(activityLevel) {
  const multipliers = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
  };

  return multipliers[activityLevel] || multipliers.light;
}

function calculateBmr({ weightKg, heightCm, age, gender }) {
  const base = 10 * weightKg + 6.25 * heightCm - 5 * age;

  if (gender === "male") {
    return base + 5;
  }

  if (gender === "female") {
    return base - 161;
  }

  return base - 78;
}

function calculateTargetCalories(profile) {
  const maintenanceCalories = calculateBmr(profile) * activityMultiplier(profile.activityLevel);
  const goalAdjustments = {
    weight_loss: -400,
    muscle_gain: 300,
    maintenance: 0,
  };

  return Math.max(1200, Math.round(maintenanceCalories + goalAdjustments[profile.goal]));
}

function calculateHealthMetrics(profile) {
  return {
    bmi: calculateBmi(profile.weightKg, profile.heightCm),
    targetCalories: calculateTargetCalories(profile),
  };
}

module.exports = {
  calculateHealthMetrics,
};
