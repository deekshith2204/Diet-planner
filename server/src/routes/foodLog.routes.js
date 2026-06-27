const router = require("express").Router();
const { createFoodLog, deleteFoodLog, listFoodLogs } = require("../controllers/foodLog.controller");
const { protect } = require("../middleware/auth");
const validateRequest = require("../middleware/validateRequest");
const {
  dateRangeValidation,
  foodLogIdValidation,
  foodLogValidation,
} = require("../validators/foodLog.validators");

router.use(protect);

router.get("/", dateRangeValidation, validateRequest, listFoodLogs);
router.post("/", foodLogValidation, validateRequest, createFoodLog);
router.delete("/:id", foodLogIdValidation, validateRequest, deleteFoodLog);

module.exports = router;
