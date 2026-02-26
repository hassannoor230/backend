const express = require("express");
const router = express.Router();
const { getAdjustments, createAdjustment } = require("../controllers/adjustmentController");
const { protect } = require("../middleware/authMiddleware");
const { authorize } = require("../middleware/roleMiddleware");

router.use(protect, authorize("admin", "inventory"));

router.route("/")
  .get(getAdjustments)
  .post(createAdjustment);

module.exports = router;