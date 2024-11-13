// controllers/dashboards/totalStock.js
const {
  StockIn,
  StockHistory,
  StockOut,
  Product,
  Supplier,
  User,
} = require("../../models"); // Pastikan path model sesuai
const { Sequelize } = require("sequelize");
const { Op } = require("sequelize");

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
    const stockIns = await StockIn.findAll({
      attributes: [
        [Sequelize.fn("DATE", Sequelize.col("createdAt")), "date"],
        [Sequelize.col("quantity"), "quantity"],
      ],
      order: [["createdAt", "ASC"]],
    });

    const stockOuts = await StockHistory.findAll({
      attributes: [
        [Sequelize.fn("DATE", Sequelize.col("createdAt")), "date"],
        [Sequelize.col("quantity"), "quantity"],
      ],
      order: [["createdAt", "ASC"]],
    });

    const combinedData = [
      ...stockIns.map((entry) => ({
        date: entry.dataValues.date,
        quantity: entry.dataValues.quantity,
        type: "in",
      })),
      ...stockOuts.map((entry) => ({
        date: entry.dataValues.date,
        quantity: entry.dataValues.quantity,
        type: "out",
      })),
    ].sort((a, b) => new Date(a.date) - new Date(b.date));

    const endDate = new Date();
    const startDate = new Date(endDate);
    startDate.setDate(endDate.getDate() - 29);

    const dateList = [];
    let currentDate = new Date(startDate);
    while (currentDate <= endDate) {
      dateList.push(currentDate.toISOString().split("T")[0]);
      currentDate.setDate(currentDate.getDate() + 1);
    }

    let totalRemaining = 0;
    const stockFlowData = [];

    dateList.forEach((formattedDate) => {
      const dataForDate = combinedData.filter(
        (entry) => entry.date === formattedDate
      );

      dataForDate.forEach((entry) => {
        totalRemaining +=
          entry.type === "in" ? entry.quantity : -entry.quantity;
      });

      stockFlowData.push({
        date: formattedDate,
        totalRemaining,
      });
    });

    res.json({ stockFlowData });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getRecentStockHistory = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 10; // Jumlah item per halaman
    const offset = (page - 1) * limit;

    // Mengambil data stok yang masuk dari StockIn
    const stockInData = await StockIn.findAll({
      offset,
      limit,
      order: [["createdAt", "DESC"]],
      attributes: [
        "supplierId",
        "productId",
        "quantity",
        "created_by",
        "createdAt",
        "stock_code",
      ],
      include: [
        {
          model: Product,
          as: "product",
          attributes: ["product_name"],
        },
        {
          model: Supplier,
          as: "supplier",
          attributes: ["supplier_name"],
        },
        {
          model: User,
          as: "Creator",
          attributes: ["username"],
        },
      ],
    });

    // Mengambil data stok yang keluar dari StockHistory
    const stockHistoryData = await StockHistory.findAll({
      offset,
      limit,
      order: [["createdAt", "DESC"]],
      attributes: [
        "created_by",
        "productId",
        "quantity",
        "grosir_choice",
        "createdAt",
        "stock_code",
      ],
      include: [
        {
          model: Product,
          as: "product",
          attributes: ["product_name"],
        },
        {
          model: User,
          as: "Creator",
          attributes: ["username"],
        },
      ],
    });

    // Gabungkan data dari StockIn dan StockHistory
    const combinedHistory = [...stockInData, ...stockHistoryData];

    // Urutkan berdasarkan createdAt
    combinedHistory.sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );

    res.json({
      history: combinedHistory.slice(0, limit).map((entry) => ({
        createdAt: entry.createdAt,
        created_by: entry.created_by || "",
        stock_code: entry.stock_code,
        quantity: entry.quantity,
        grosir_choice: entry.grosir_choice || "",
        product_name: entry.product ? entry.product.product_name : "Unknown",
        supplier_name: entry.supplier
          ? entry.supplier.supplier_name
          : "Unknown",
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
    // Ambil data StockOut dengan quantity_remaining antara 1 dan 5
    const notifications = await StockOut.findAll({
      where: {
        quantity_remaining: {
          [Op.gt]: 0, // Lebih besar dari 0
        },
      },
      order: [["quantity_remaining", "ASC"]],
      attributes: ["quantity_remaining"], // Ambil atribut yang diperlukan dari StockOut
      include: [
        {
          model: Product,
          as: "product", // Gunakan alias yang sesuai dengan asosiasi di model
          attributes: ["product_name", "product_code"], // Ambil nama produk dan kode produk
        },
      ],
    });

    if (!notifications) {
      throw new Error("No notifications data found");
    }

    // Agregasi quantity_remaining berdasarkan product_name dan product_code
    const productQuantities = {};

    notifications.forEach((notification) => {
      const productName = notification.product.product_name;
      const productCode = notification.product.product_code;
      const quantityRemaining = notification.quantity_remaining;

      if (!productQuantities[productCode]) {
        productQuantities[productCode] = {
          product_name: productName,
          product_code: productCode,
          total_quantity: 0,
        };
      }

      productQuantities[productCode].total_quantity += quantityRemaining;
    });

    // Hanya ambil produk dengan total_quantity_remaining < 6
    const result = Object.values(productQuantities)
      .filter((item) => item.total_quantity < 6)
      .map((item) => ({
        product_name: item.product_name,
        product_code: item.product_code,
        quantity_remaining: item.total_quantity,
      }));

    res.json({
      notifications: result,
    });
  } catch (error) {
    console.error(error);
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
