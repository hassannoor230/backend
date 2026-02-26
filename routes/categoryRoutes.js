const express = require("express");
const router = express.Router();
const { getCategories, createCategory, updateCategory, deleteCategory } = require("../controllers/categoryController");
const { protect } = require("../middleware/authMiddleware");
const { authorize } = require("../middleware/roleMiddleware");

router.use(protect);

router.route("/")
  .get(getCategories)
  .post(authorize("admin"), createCategory);

router.route("/:id")
  .put(authorize("admin"), updateCategory)
  .delete(authorize("admin"), deleteCategory);

module.exports = router;