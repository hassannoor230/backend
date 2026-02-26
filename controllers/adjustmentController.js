const Adjustment = require("../models/Adjustment");
const Product = require("../models/Product");

// @desc    Get all adjustments
// @route   GET /api/adjustments
// @access  Admin, Inventory
const getAdjustments = async (req, res) => {
  try {
    const adjustments = await Adjustment.find()
      .populate("product", "name sku stock")
      .populate("createdBy", "name")
      .sort({ createdAt: -1 });

    res.json({ success: true, count: adjustments.length, data: adjustments });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create adjustment
// @route   POST /api/adjustments
// @access  Admin, Inventory
const createAdjustment = async (req, res) => {
  try {
    const { product, type, quantity, reason } = req.body;

    if (!product || !type || !quantity) {
      return res.status(400).json({ message: "Product, type and quantity are required" });
    }

    const productDoc = await Product.findById(product);
    if (!productDoc) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (type === "subtraction" && productDoc.stock < quantity) {
      return res.status(400).json({
        message: `Cannot subtract ${quantity}. Current stock is ${productDoc.stock}`,
      });
    }

    const stockChange = type === "addition" ? quantity : -quantity;

    await Product.findByIdAndUpdate(product, {
      $inc: { stock: stockChange },
    });

    const adjustment = await Adjustment.create({
      product,
      type,
      quantity,
      reason: reason || "",
      createdBy: req.user._id,
    });

    const populated = await adjustment.populate([
      { path: "product", select: "name sku stock" },
      { path: "createdBy", select: "name" },
    ]);

    res.status(201).json({ success: true, data: populated });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getAdjustments, createAdjustment };