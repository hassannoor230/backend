const Sale = require("../models/Sale");
const Product = require("../models/Product");
const User = require("../models/User");

// @desc    Get sales report
// @route   GET /api/reports/sales
// @access  Admin
const getSalesReport = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    let filter = { status: "completed" };

    if (startDate && endDate) {
      filter.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(new Date(endDate).setHours(23, 59, 59, 999)),
      };
    }

    const sales = await Sale.find(filter).populate("cashier", "name");

    const totalRevenue = sales.reduce((sum, s) => sum + s.total, 0);
    const totalTax = sales.reduce((sum, s) => sum + s.tax, 0);
    const totalDiscount = sales.reduce((sum, s) => sum + s.discount, 0);

    // Sales by payment method
    const byPaymentMethod = sales.reduce((acc, sale) => {
      acc[sale.paymentMethod] = (acc[sale.paymentMethod] || 0) + sale.total;
      return acc;
    }, {});

    // Daily sales summary
    const dailySales = sales.reduce((acc, sale) => {
      const date = sale.createdAt.toISOString().split("T")[0];
      if (!acc[date]) acc[date] = { date, count: 0, revenue: 0 };
      acc[date].count += 1;
      acc[date].revenue += sale.total;
      return acc;
    }, {});

    res.json({
      success: true,
      data: {
        totalRevenue,
        totalTax,
        totalDiscount,
        totalSales: sales.length,
        byPaymentMethod,
        dailySales: Object.values(dailySales).sort((a, b) =>
          a.date.localeCompare(b.date)
        ),
        sales,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get inventory report
// @route   GET /api/reports/inventory
// @access  Admin
const getInventoryReport = async (req, res) => {
  try {
    const products = await Product.find().populate("category", "name");

    const totalProducts = products.length;
    const totalStockValue = products.reduce(
      (sum, p) => sum + p.stock * p.costPrice,
      0
    );
    const lowStockProducts = products.filter((p) => p.stock <= p.minStock);
    const outOfStock = products.filter((p) => p.stock === 0);

    res.json({
      success: true,
      data: {
        totalProducts,
        totalStockValue,
        lowStockCount: lowStockProducts.length,
        outOfStockCount: outOfStock.length,
        lowStockProducts,
        outOfStock,
        products,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get dashboard stats
// @route   GET /api/reports/dashboard
// @access  Admin
const getDashboardStats = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    // Today's sales
    const todaySales = await Sale.find({
      createdAt: { $gte: today, $lte: todayEnd },
      status: "completed",
    });

    const todayRevenue = todaySales.reduce((sum, s) => sum + s.total, 0);

    // Total products
    const totalProducts = await Product.countDocuments();

    // Low stock products
    const lowStock = await Product.countDocuments({
      $expr: { $lte: ["$stock", "$minStock"] },
    });

    // Total users
    const totalUsers = await User.countDocuments();

    // Last 7 days sales
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const weeklySales = await Sale.find({
      createdAt: { $gte: sevenDaysAgo },
      status: "completed",
    });

    const weeklyRevenue = weeklySales.reduce((sum, s) => sum + s.total, 0);

    // Recent sales (last 5)
    const recentSales = await Sale.find({ status: "completed" })
      .populate("cashier", "name")
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      success: true,
      data: {
        todayRevenue,
        todaySalesCount: todaySales.length,
        weeklyRevenue,
        weeklySalesCount: weeklySales.length,
        totalProducts,
        lowStockCount: lowStock,
        totalUsers,
        recentSales,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get financial report
// @route   GET /api/reports/financial
// @access  Admin
const getFinancialReport = async (req, res) => {
  try {
    // Total revenue from completed sales
    const salesData = await Sale.find({ status: "completed" });
    const totalRevenue = salesData.reduce((sum, s) => sum + s.total, 0);
    const totalTax = salesData.reduce((sum, s) => sum + s.tax, 0);
    const totalDiscount = salesData.reduce((sum, s) => sum + s.discount, 0);

    // Total cost value of current stock
    const products = await Product.find({ isActive: true });
    const totalStockCost = products.reduce(
      (sum, p) => sum + p.costPrice * p.stock,
      0
    );

    // Cost of goods sold (from sales)
    const totalCOGS = salesData.reduce((sum, sale) => {
      return sum + sale.subtotal * 0.75; // approximate 75% cost ratio
    }, 0);

    const grossProfit = totalRevenue - totalCOGS;
    const netProfit = grossProfit + totalTax - totalDiscount;

    // Monthly breakdown
    const monthlyData = salesData.reduce((acc, sale) => {
      const month = new Date(sale.createdAt).toLocaleString("default", {
        month: "short",
        year: "numeric",
      });
      if (!acc[month]) {
        acc[month] = { month, revenue: 0, count: 0 };
      }
      acc[month].revenue += sale.total;
      acc[month].count += 1;
      return acc;
    }, {});

    res.json({
      success: true,
      data: {
        totalRevenue,
        totalTax,
        totalDiscount,
        totalStockCost,
        totalExpenses: totalCOGS,
        grossProfit,
        netProfit,
        totalSales: salesData.length,
        monthlyBreakdown: Object.values(monthlyData),
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getSalesReport,
  getInventoryReport,
  getDashboardStats,
  getFinancialReport, // ← yeh add kiya
};