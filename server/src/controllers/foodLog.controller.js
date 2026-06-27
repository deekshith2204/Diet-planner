const FoodLog = require("../models/FoodLog");
const asyncHandler = require("../utils/asyncHandler");
const { getDateRange } = require("../utils/dateRange");

function publicFoodLog(log) {
  return {
    id: log.id,
    date: log.date,
    foodItem: log.foodItem,
    calories: log.calories,
    proteinG: log.proteinG,
    carbsG: log.carbsG,
    fatG: log.fatG,
    mealType: log.mealType,
    notes: log.notes,
  };
}

const listFoodLogs = asyncHandler(async (req, res) => {
  const { from, to } = getDateRange(req.query);
  const logs = await FoodLog.find({
    userId: req.user.id,
    date: { $gte: from, $lte: to },
  }).sort({ date: -1, createdAt: -1 });

  res.json({ logs: logs.map(publicFoodLog) });
});

const createFoodLog = asyncHandler(async (req, res) => {
  const log = await FoodLog.create({
    userId: req.user.id,
    date: req.body.date,
    foodItem: req.body.foodItem,
    calories: Number(req.body.calories),
    proteinG: Number(req.body.proteinG || 0),
    carbsG: Number(req.body.carbsG || 0),
    fatG: Number(req.body.fatG || 0),
    mealType: req.body.mealType,
    notes: req.body.notes,
  });

  res.status(201).json({
    message: "Food logged",
    log: publicFoodLog(log),
  });
});

const deleteFoodLog = asyncHandler(async (req, res) => {
  const log = await FoodLog.findOneAndDelete({ _id: req.params.id, userId: req.user.id });

  if (!log) {
    return res.status(404).json({ message: "Food log was not found" });
  }

  return res.json({ message: "Food log deleted" });
});

module.exports = {
  listFoodLogs,
  createFoodLog,
  deleteFoodLog,
};
