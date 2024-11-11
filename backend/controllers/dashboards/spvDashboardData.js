// controllers/dashboards/spvDashboardData.js
const { StockIn, StockHistory } = require("../../models"); // Pastikan path model sesuai

const getSupervisorStockSummary = async (req, res) => {
  try {
    // Mengambil total stok yang masuk dari tabel StockIn
    const totalStockIn = await StockIn.sum("quantity"); // Sum dari quantity pada tabel StockIn

    // Mengambil total stok yang keluar dari tabel StockHistory
    const totalStockOut = await StockHistory.sum("quantity"); // Sum dari quantity pada tabel StockHistory

    // Mengirimkan data total stok masuk dan keluar
    res.json({
      stockIn: totalStockIn || 0, // Jika tidak ada data, return 0
      stockOut: totalStockOut || 0, // Jika tidak ada data, return 0
    });
  } catch (error) {
    console.error("Error fetching total stock-in and stock-out data:", error);
    res
      .status(500)
      .json({ error: "Failed to get total stock-in and stock-out data" });
  }
};

module.exports = {
  getSupervisorStockSummary,
};
