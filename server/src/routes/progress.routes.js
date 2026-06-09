const router = require("express").Router();

router.get("/status", (req, res) => {
  res.json({ message: "Progress routes ready" });
});

module.exports = router;
