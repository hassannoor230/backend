const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const { authorize } = require("../middleware/roleMiddleware");
const {
  getSalesReport,
  getInventoryReport,
  getDashboardStats,
  getFinancialReport,
} = require("../controllers/reportController");

router.use(protect);
router.use(authorize(["admin"]));

router.get("/dashboard", getDashboardStats);
router.get("/sales", getSalesReport);
router.get("/inventory", getInventoryReport);
router.get("/financial", getFinancialReport);

module.exports = router;