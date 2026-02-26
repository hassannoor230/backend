const mongoose = require("mongoose");

const saleItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  name: { type: String, required: true },
  quantity: { type: Number, required: true, min: 1 },
  price: { type: Number, required: true },
  total: { type: Number, required: true },
});

const saleSchema = new mongoose.Schema(
  {
    invoiceNumber: { type: String, unique: true },
    cashier: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    customer: { type: String, default: "Walk-in Customer" },
    items: {
      type: [saleItemSchema],
      validate: {
        validator: (v) => v.length > 0,
        message: "Sale must have at least one item",
      },
    },
    subtotal: { type: Number, required: true },
    tax: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    total: { type: Number, required: true },
    paymentMethod: {
      type: String,
      enum: ["cash", "card", "online", "other"],
      default: "cash",
    },
    status: {
      type: String,
      enum: ["completed", "pending", "refunded"],
      default: "completed",
    },
    note: { type: String, default: "" },
  },
  { timestamps: true }
);

// Auto generate invoice number
saleSchema.pre("save", async function () {
  if (!this.invoiceNumber) {
    const count = await mongoose.model("Sale").countDocuments();
    this.invoiceNumber = `INV-${String(count + 1).padStart(6, "0")}`;
  }
});

module.exports = mongoose.model("Sale", saleSchema);