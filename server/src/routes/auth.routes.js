const router = require("express").Router();

router.get("/status", (req, res) => {
  res.json({ message: "Auth routes ready" });
});

module.exports = router;
