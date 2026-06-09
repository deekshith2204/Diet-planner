const router = require("express").Router();

router.get("/status", (req, res) => {
  res.json({ message: "Health profile routes ready" });
});

module.exports = router;
