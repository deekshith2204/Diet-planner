const router = require("express").Router();
const {
  getMyHealthProfile,
  upsertMyHealthProfile,
} = require("../controllers/healthProfile.controller");
const { protect } = require("../middleware/auth");
const validateRequest = require("../middleware/validateRequest");
const { healthProfileValidation } = require("../validators/healthProfile.validators");

router.use(protect);

router.get("/me", getMyHealthProfile);
router.put("/me", healthProfileValidation, validateRequest, upsertMyHealthProfile);

module.exports = router;
