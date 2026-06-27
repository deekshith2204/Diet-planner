const Progress = require("../models/Progress");
const asyncHandler = require("../utils/asyncHandler");
const { getDateRange } = require("../utils/dateRange");

function publicProgress(entry) {
  return {
    id: entry.id,
    date: entry.date,
    weightKg: entry.weightKg,
    energyLevel: entry.energyLevel,
    notes: entry.notes,
  };
}

const listProgress = asyncHandler(async (req, res) => {
  const { from, to } = getDateRange(req.query);
  const entries = await Progress.find({
    userId: req.user.id,
    date: { $gte: from, $lte: to },
  }).sort({ date: 1 });

  res.json({ progress: entries.map(publicProgress) });
});

const upsertProgress = asyncHandler(async (req, res) => {
  const date = new Date(req.body.date);
  date.setHours(0, 0, 0, 0);

  const entry = await Progress.findOneAndUpdate(
    { userId: req.user.id, date },
    {
      userId: req.user.id,
      date,
      weightKg: Number(req.body.weightKg),
      energyLevel: req.body.energyLevel ? Number(req.body.energyLevel) : undefined,
      notes: req.body.notes,
    },
    { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }
  );

  res.status(200).json({
    message: "Progress saved",
    progress: publicProgress(entry),
  });
});

module.exports = {
  listProgress,
  upsertProgress,
};
