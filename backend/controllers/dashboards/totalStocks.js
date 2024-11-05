// controllers/dashboards/totalStock.js

const { StockIn, StockHistory, StockOut } = require("../../models"); // Pastikan path model sesuai
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
      .map((entry) => ({
        date: entry.date,
        quantity: entry.quantity,
        type: entry instanceof StockIn ? "in" : "out",
      }))
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

module.exports = {
  getTotalAssets,
  getTotalWarehouseItems,
  getTotalOutgoingItems,
  getStockFlow,
};
