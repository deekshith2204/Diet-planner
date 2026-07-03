const router = require("express").Router();
const { body } = require("express-validator");
const { askAssistant } = require("../controllers/assistant.controller");
const { protect } = require("../middleware/auth");
const validateRequest = require("../middleware/validateRequest");

router.use(protect);

router.post(
  "/ask",
  [body("message").trim().isLength({ min: 3, max: 1000 }).withMessage("Ask a question between 3 and 1000 characters")],
  validateRequest,
  askAssistant
);

module.exports = router;
