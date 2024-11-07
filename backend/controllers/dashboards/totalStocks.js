// controllers/dashboards/totalStock.js

const {
  StockIn,
  StockHistory,
  StockOut,
  Product,
  Supplier,
} = require("../../models"); // Pastikan path model sesuai
const { Sequelize } = require("sequelize");

const getTotalAssets = async (req, res) => {
  try {
    const totalPurchase = await StockIn.sum("total_purchase_price");
    const totalStockHistory = await StockHistory.sum("stock_price");
    const totalAssets = totalPurchase - totalStockHistory;
    res.json({ totalAssets });
  } catch (error) {
    res.status(500).json({ error: "Error calculating total assets" });
  }
};

const getTotalWarehouseItems = async (req, res) => {
  try {
    const totalItems = await StockOut.sum("quantity_remaining");
    res.json({ totalItems });
  } catch (error) {
    res.status(500).json({ error: "Error calculating total warehouse items" });
  }
};

const getTotalIncomingItems = async (req, res) => {
  try {
    const totalIncoming = await StockIn.sum("quantity");
    res.json({ totalIncoming });
  } catch (error) {
    res.status(500).json({ error: "Error calculating total incoming items" });
  }
};

const getTotalOutgoingItems = async (req, res) => {
  try {
    const totalOutgoing = await StockHistory.sum("quantity");
    res.json({ totalOutgoing });
  } catch (error) {
    res.status(500).json({ error: "Error calculating total outgoing items" });
  }
};

const getStockFlow = async (req, res) => {
  try {
    // Ambil data pemasukan (stock in)
    const stockIns = await StockIn.findAll({
      attributes: [
        [Sequelize.col("createdAt"), "date"],
        [Sequelize.col("quantity"), "quantity"],
      ],
      order: [["createdAt", "ASC"]],
    });

    // Ambil data pengeluaran (stock out) dari StockHistory
    const stockOuts = await StockHistory.findAll({
      attributes: [
        [Sequelize.col("createdAt"), "date"],
        [Sequelize.col("quantity"), "quantity"],
      ],
      order: [["createdAt", "ASC"]],
    });

    // Gabungkan data stock in dan stock out
    const combinedData = [...stockIns, ...stockOuts]
      .map((entry) => {
        const { date, quantity } = entry.dataValues; // Ambil nilai dari dataValues
        return {
          date,
          quantity,
          type: entry instanceof StockIn ? "in" : "out",
        };
      })
      .sort((a, b) => new Date(a.date) - new Date(b.date));

    // Hitung stok kumulatif berdasarkan pemasukan dan pengeluaran
    let totalRemaining = 0;
    const stockFlowData = combinedData.map((entry) => {
      totalRemaining += entry.type === "in" ? entry.quantity : -entry.quantity;
      return {
        date: entry.date,
        totalRemaining,
      };
    });

    res.json({ stockFlowData });
  } catch (error) {
    console.error("Error fetching stock flow data", error);
    res.status(500).json({ error: "Error fetching stock flow data" });
  }
};

const getRecentStockHistory = async (req, res) => {
  try {
    // Mengambil data stok yang masuk dari StockIn dan stok yang keluar dari StockHistory
    const stockInData = await StockIn.findAll({
      limit: 10,
      order: [["createdAt", "DESC"]],
      attributes: ["createdAt", "stock_code", "quantity", "grosir_choice"],
      include: [
        {
          model: Product,
          as: "product",
          attributes: ["product_name"], // Ambil nama produk untuk ditampilkan
        },
        {
          model: Supplier,
          as: "supplier",
          attributes: ["supplier_name"], // Ambil nama supplier untuk ditampilkan
        },
      ],
    });

    const stockHistoryData = await StockHistory.findAll({
      limit: 10,
      order: [["createdAt", "DESC"]],
      attributes: ["createdAt", "stock_code", "quantity", "grosir_choice"],
      include: [
        {
          model: Product,
          as: "product",
          attributes: ["product_name"], // Ambil nama produk untuk ditampilkan
        },
        {
          model: Supplier,
          as: "supplier",
          attributes: ["supplier_name"], // Ambil nama supplier untuk ditampilkan
        },
      ],
    });

    // Gabungkan data dari StockIn dan StockHistory
    const combinedHistory = [...stockInData, ...stockHistoryData];

    if (!combinedHistory || combinedHistory.length === 0) {
      throw new Error("No stock history data found");
    }

    // Urutkan berdasarkan createdAt (terbaru)
    combinedHistory.sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );

    // Format data yang dikembalikan
    res.json({
      history: combinedHistory.map((entry) => ({
        createdAt: entry.createdAt,
        stock_code: entry.stock_code,
        quantity: entry.quantity,
        grosir_choice: entry.grosir_choice,
        product_name: entry.product ? entry.product.product_name : "Unknown", // Pastikan ada nama produk
        supplier_name: entry.supplier
          ? entry.supplier.supplier_name
          : "Unknown", // Pastikan ada nama supplier
      })),
    });
  } catch (error) {
    console.error("Error occurred while fetching recent stock history:", error);
    res.status(500).json({ error: "Failed to get recent stock history" });
  }
};

// Fungsi untuk mengambil notifikasi stok rendah
const getLowStockNotifications = async (req, res) => {
  try {
    const notifications = await StockOut.findAll({
      where: { quantity_remaining: { [Op.lt]: 10 } }, // Misalnya, stok rendah jika kurang dari 10
      order: [["quantity_remaining", "ASC"]],
      attributes: ["product_name", "quantity_remaining"], // Pastikan atribut yang diperlukan ada
      include: [
        {
          model: Product,
          as: "product", // Menggunakan alias 'product' sesuai asosiasi di model
          attributes: ["product_name"], // Ambil nama produk
        },
        {
          model: Supplier,
          as: "supplier", // Menggunakan alias 'supplier' sesuai asosiasi di model
          attributes: ["supplier_name"], // Ambil nama supplier (jika diperlukan)
        },
      ],
    });
    if (!notifications) {
      throw new Error("No notifications data found");
    }
    // Mengirimkan data dalam format yang lebih lengkap
    res.json({
      notifications: notifications.map((notification) => ({
        product_name: notification.product
          ? notification.product.product_name
          : "Unknown",
        quantity_remaining: notification.quantity_remaining,
        supplier_name: notification.supplier
          ? notification.supplier.supplier_name
          : "Unknown", // Supplier jika diperlukan
      })),
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to get low stock notifications" });
  }
};

module.exports = {
  getTotalAssets,
  getTotalWarehouseItems,
  getTotalOutgoingItems,
  getTotalIncomingItems,
  getStockFlow,
  getRecentStockHistory,
  getLowStockNotifications,
};
