const router = require("express").Router();
const { listProgress, upsertProgress } = require("../controllers/progress.controller");
const { protect } = require("../middleware/auth");
const validateRequest = require("../middleware/validateRequest");
const { dateRangeValidation, progressValidation } = require("../validators/progress.validators");

router.use(protect);

router.get("/", dateRangeValidation, validateRequest, listProgress);
router.put("/", progressValidation, validateRequest, upsertProgress);

module.exports = router;
