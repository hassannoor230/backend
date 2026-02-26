const express = require("express");
const router = express.Router();
const { getProducts, getProduct, createProduct, updateProduct, deleteProduct } = require("../controllers/productController");
const { protect } = require("../middleware/authMiddleware");
const { authorize } = require("../middleware/roleMiddleware");

router.use(protect);

router.route("/")
  .get(getProducts)
  .post(authorize("admin", "inventory"), createProduct);

router.route("/:id")
  .get(getProduct)
  .put(authorize("admin", "inventory"), updateProduct)
  .delete(authorize("admin"), deleteProduct);

module.exports = router;