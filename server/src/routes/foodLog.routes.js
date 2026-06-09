const router = require("express").Router();

router.get("/status", (req, res) => {
  res.json({ message: "Food log routes ready" });
});

module.exports = router;
