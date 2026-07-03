const router = require("express").Router();
const authRoutes = require("./auth.routes");
const healthProfileRoutes = require("./healthProfile.routes");
const mealPlanRoutes = require("./mealPlan.routes");
const foodLogRoutes = require("./foodLog.routes");
const progressRoutes = require("./progress.routes");
const dashboardRoutes = require("./dashboard.routes");
const nutritionRoutes = require("./nutrition.routes");
const assistantRoutes = require("./assistant.routes");

router.use("/auth", authRoutes);
router.use("/health-profile", healthProfileRoutes);
router.use("/meal-plans", mealPlanRoutes);
router.use("/food-logs", foodLogRoutes);
router.use("/progress", progressRoutes);
router.use("/dashboard", dashboardRoutes);
router.use("/nutrition", nutritionRoutes);
router.use("/assistant", assistantRoutes);

module.exports = router;
