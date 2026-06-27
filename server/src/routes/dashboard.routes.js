const router = require("express").Router();
const { getDashboardSummary } = require("../controllers/dashboard.controller");
const { protect } = require("../middleware/auth");
const validateRequest = require("../middleware/validateRequest");
const { dateRangeValidation } = require("../validators/foodLog.validators");

router.use(protect);

router.get("/summary", dateRangeValidation, validateRequest, getDashboardSummary);

module.exports = router;
