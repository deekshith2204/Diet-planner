const HealthProfile = require("../models/HealthProfile");
const asyncHandler = require("../utils/asyncHandler");
const { answerUserQuestion } = require("../services/assistant.service");

const askAssistant = asyncHandler(async (req, res) => {
  const profile = await HealthProfile.findOne({ userId: req.user.id });
  const answer = await answerUserQuestion({
    message: req.body.message,
    profile,
  });

  res.json({ answer });
});

module.exports = {
  askAssistant,
};
