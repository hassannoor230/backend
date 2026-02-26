const Sale = require("../models/Sale");
const Product = require("../models/Product");

// @desc    Get all sales
// @route   GET /api/sales
// @access  Private
const getSales = async (req, res) => {
  try {
    const { startDate, endDate, status, cashier } = req.query;
    let filter = {};

    // Cashier sirf apni sales dekhe
    if (req.user.role === "cashier") {
      filter.cashier = req.user._id;
    }

    if (cashier && req.user.role === "admin") filter.cashier = cashier;
    if (status) filter.status = status;

    if (startDate && endDate) {
      filter.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(new Date(endDate).setHours(23, 59, 59, 999)),
      };
    }

    const sales = await Sale.find(filter)
      .populate("cashier", "name email")
      .sort({ createdAt: -1 });

    const totalRevenue = sales
      .filter((s) => s.status === "completed")
      .reduce((sum, s) => sum + s.total, 0);

    res.json({
      success: true,
      count: sales.length,
      totalRevenue,
      data: sales,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single sale
// @route   GET /api/sales/:id
// @access  Private
const getSale = async (req, res) => {
  try {
    const sale = await Sale.findById(req.params.id)
      .populate("cashier", "name email")
      .populate("items.product", "name sku");

    if (!sale) {
      return res.status(404).json({ message: "Sale not found" });
    }

    res.json({ success: true, data: sale });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create sale (POS)
// @route   POST /api/sales
// @access  Admin, Cashier
const createSale = async (req, res) => {
  try {
    const { items, subtotal, tax, discount, total, paymentMethod, customer, note } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "Sale must have at least one item" });
    }

    // Check stock availability & reduce stock
    for (const item of items) {
      const product = await Product.findById(item.product);

      if (!product) {
        return res.status(404).json({ message: `Product not found: ${item.name}` });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({
          message: `Insufficient stock for ${product.name}. Available: ${product.stock}`,
        });
      }

      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: -item.quantity },
      });
    }

    const sale = await Sale.create({
      cashier: req.user._id,
      items,
      subtotal,
      tax: tax || 0,
      discount: discount || 0,
      total,
      paymentMethod: paymentMethod || "cash",
      customer: customer || "Walk-in Customer",
      note: note || "",
    });

    const populated = await sale.populate("cashier", "name email");

    res.status(201).json({ success: true, data: populated });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update sale status
// @route   PUT /api/sales/:id
// @access  Admin
const updateSaleStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!["completed", "pending", "refunded"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const sale = await Sale.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate("cashier", "name email");

    if (!sale) {
      return res.status(404).json({ message: "Sale not found" });
    }

    res.json({ success: true, data: sale });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete sale
// @route   DELETE /api/sales/:id
// @access  Admin
const deleteSale = async (req, res) => {
  try {
    const sale = await Sale.findByIdAndDelete(req.params.id);

    if (!sale) {
      return res.status(404).json({ message: "Sale not found" });
    }

    res.json({ success: true, message: "Sale deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getSales, getSale, createSale, updateSaleStatus, deleteSale };