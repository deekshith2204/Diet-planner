const FoodLog = require("../models/FoodLog");
const HealthProfile = require("../models/HealthProfile");
const MealPlan = require("../models/MealPlan");
const Progress = require("../models/Progress");
const asyncHandler = require("../utils/asyncHandler");
const { buildConditionTips } = require("../utils/conditionTips");
const { getDateRange } = require("../utils/dateRange");

function formatDate(date) {
  return date.toISOString().slice(0, 10);
}

function eachDate(from, to) {
  const dates = [];
  const cursor = new Date(from);

  while (cursor <= to) {
    dates.push(new Date(cursor));
    cursor.setDate(cursor.getDate() + 1);
  }

  return dates;
}

const getDashboardSummary = asyncHandler(async (req, res) => {
  const { from, to } = getDateRange(req.query);
  const [profile, foodLogs, progress, mealPlans] = await Promise.all([
    HealthProfile.findOne({ userId: req.user.id }),
    FoodLog.find({ userId: req.user.id, date: { $gte: from, $lte: to } }),
    Progress.find({ userId: req.user.id, date: { $gte: from, $lte: to } }).sort({ date: 1 }),
    MealPlan.find({ userId: req.user.id, date: { $gte: from, $lte: to } }),
  ]);

  const logsByDate = foodLogs.reduce((grouped, log) => {
    const key = formatDate(log.date);
    grouped[key] = grouped[key] || [];
    grouped[key].push(log);
    return grouped;
  }, {});

  const plansByDate = mealPlans.reduce((grouped, plan) => {
    grouped[formatDate(plan.date)] = plan;
    return grouped;
  }, {});

  const dailyCalories = eachDate(from, to).map((date) => {
    const key = formatDate(date);
    const consumed = (logsByDate[key] || []).reduce((sum, log) => sum + log.calories, 0);
    const target = plansByDate[key]?.totalCalories || profile?.targetCalories || 0;

    return {
      date: key,
      consumed,
      target,
    };
  });

  const plannedDays = dailyCalories.filter((day) => day.target > 0);
  const adherenceDays = plannedDays.filter((day) => {
    const lower = day.target * 0.85;
    const upper = day.target * 1.15;
    return day.consumed >= lower && day.consumed <= upper;
  });

  res.json({
    targetCalories: profile?.targetCalories || 0,
    dailyCalories,
    weightTrend: progress.map((entry) => ({
      date: formatDate(entry.date),
      weightKg: entry.weightKg,
      energyLevel: entry.energyLevel,
    })),
    adherencePercent: plannedDays.length ? Math.round((adherenceDays.length / plannedDays.length) * 100) : 0,
    conditionTips: buildConditionTips(profile?.conditions || [], foodLogs),
  });
});

module.exports = {
  getDashboardSummary,
};
