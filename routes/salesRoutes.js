const express = require("express");
const router = express.Router();
const { getSales, getSale, createSale, updateSaleStatus, deleteSale } = require("../controllers/salesController");
const { protect } = require("../middleware/authMiddleware");
const { authorize } = require("../middleware/roleMiddleware");

router.use(protect);

router.route("/")
  .get(getSales)
  .post(authorize("admin", "cashier"), createSale);

router.route("/:id")
  .get(getSale)
  .put(authorize("admin"), updateSaleStatus)
  .delete(authorize("admin"), deleteSale);

module.exports = router;