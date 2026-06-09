const router = require("express").Router();

router.get("/status", (req, res) => {
  res.json({ message: "Meal plan routes ready" });
});

module.exports = router;
