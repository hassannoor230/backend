const express = require("express");
const router = express.Router();
const {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  addVariant,
  updateVariant,
  deleteVariant,
} = require("../controllers/productController");
const { protect } = require("../middleware/authMiddleware");
const { authorize } = require("../middleware/roleMiddleware");

router.use(protect);

// ── Product routes ──
router.route("/")
  .get(getProducts)
  .post(authorize("admin", "inventory"), createProduct);

router.route("/:id")
  .get(getProduct)
  .put(authorize("admin", "inventory"), updateProduct)
  .delete(authorize("admin"), deleteProduct);

// ── Variant routes ──
router.post("/:id/variants", authorize("admin", "inventory"), addVariant);
router.put("/:id/variants/:variantId", authorize("admin", "inventory"), updateVariant);
router.delete("/:id/variants/:variantId", authorize("admin", "inventory"), deleteVariant);

module.exports = router;