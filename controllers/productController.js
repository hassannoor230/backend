const Product = require("../models/Product");

// @desc    Get all products
// @route   GET /api/products
// @access  Private
const getProducts = async (req, res) => {
  try {
    const { category, search, lowStock } = req.query;
    let filter = {};

    if (category) filter.category = category;

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { sku: { $regex: search, $options: "i" } },
        { barcode: { $regex: search, $options: "i" } },
      ];
    }

    if (lowStock === "true") {
      filter.$expr = { $lte: ["$stock", "$minStock"] };
    }

    const products = await Product.find(filter)
      .populate("category", "name")
      .sort({ createdAt: -1 });

    res.json({ success: true, count: products.length, data: products });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Private
const getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate("category", "name");

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({ success: true, data: product });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create product
// @route   POST /api/products
// @access  Admin, Inventory
const createProduct = async (req, res) => {
  try {
    // pull out some required fields for validation
    const { name, sku, category, price, variants } = req.body;
    console.log("[createProduct] Full req.body:", JSON.stringify(req.body, null, 2));
    console.log("[createProduct] variants array:", variants);

    if (!name || !sku || !category || price === undefined) {
      return res.status(400).json({ message: "Name, SKU, category and price are required" });
    }

    const skuExists = await Product.findOne({ sku: sku.toUpperCase() });
    if (skuExists) {
      return res.status(400).json({ message: "SKU already exists" });
    }

    // build a clean product object instead of blindly passing req.body
    const productData = {
      name,
      sku: sku.toUpperCase(),
      category,
      price,
      costPrice: req.body.costPrice || 0,
      stock: req.body.stock || 0,
      minStock: req.body.minStock || 5,
      unit: req.body.unit || "pcs",
      description: req.body.description || "",
      image: req.body.image || "",
      barcode: req.body.barcode || "",
    };

    // if variants were sent (array of objects) make sure they're copied as-is
    if (Array.isArray(variants)) {
      console.log("[createProduct] Processing variants array of length:", variants.length);
      productData.variants = variants.map((v) => {
        const variantObj = {
          name: v.name,
          price: v.price,
          stock: v.stock || 0,
          sku: v.sku || "",
          unit: v.unit || "",
        };
        console.log("[createProduct] Variant mapping:", variantObj);
        return variantObj;
      });
      console.log("[createProduct] Final productData.variants:", productData.variants);
    }

    const product = await Product.create(productData);
    console.log("[createProduct] Product created with variants:", product.variants);
    const populated = await product.populate("category", "name");

    res.status(201).json({ success: true, data: populated });
  } catch (error) {
    console.error("[createProduct] Error:", error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Admin, Inventory
const updateProduct = async (req, res) => {
  try {
    // if the client sent variants we want to replace them cleanly
    const updateData = { ...req.body };
    if (Array.isArray(req.body.variants)) {
      updateData.variants = req.body.variants.map((v) => ({
        // ignore any null/undefined _id, let mongoose manage new ones
        ...(v._id ? { _id: v._id } : {}),
        name: v.name,
        price: v.price,
        stock: v.stock || 0,
        sku: v.sku || "",
        unit: v.unit || "",
      }));
    }

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).populate("category", "name");

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({ success: true, data: product });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Admin
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({ success: true, message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ════════════════════════════════════════
//  VARIANT CONTROLLERS
// ════════════════════════════════════════

// @desc    Add variant to product
// @route   POST /api/products/:id/variants
// @access  Admin, Inventory
const addVariant = async (req, res) => {
  try {
    const { name, price, stock, sku } = req.body;

    if (!name || price === undefined) {
      return res.status(400).json({ message: "Variant name and price are required" });
    }

    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    product.variants.push({ name, price, stock: stock || 0, sku: sku || "" });
    await product.save();
    await product.populate("category", "name");

    res.status(201).json({ success: true, data: product });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a variant
// @route   PUT /api/products/:id/variants/:variantId
// @access  Admin, Inventory
const updateVariant = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const variant = product.variants.id(req.params.variantId);
    if (!variant) {
      return res.status(404).json({ message: "Variant not found" });
    }

    const { name, price, stock, sku } = req.body;
    if (name !== undefined) variant.name = name;
    if (price !== undefined) variant.price = price;
    if (stock !== undefined) variant.stock = stock;
    if (sku !== undefined) variant.sku = sku;

    await product.save();
    await product.populate("category", "name");

    res.json({ success: true, data: product });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a variant
// @route   DELETE /api/products/:id/variants/:variantId
// @access  Admin, Inventory
const deleteVariant = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    product.variants = product.variants.filter(
      (v) => v._id.toString() !== req.params.variantId
    );

    await product.save();
    await product.populate("category", "name");

    res.json({ success: true, data: product });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  addVariant,
  updateVariant,
  deleteVariant,
};