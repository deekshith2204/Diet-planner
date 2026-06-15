const router = require("express").Router();
const { generateMealPlan, getTodayMealPlan } = require("../controllers/mealPlan.controller");
const { protect } = require("../middleware/auth");

router.use(protect);

router.get("/today", getTodayMealPlan);
router.post("/generate", generateMealPlan);

module.exports = router;
