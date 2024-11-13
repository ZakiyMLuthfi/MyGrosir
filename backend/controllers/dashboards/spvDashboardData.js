const { StockIn, StockHistory, StockOut, Product } = require("../../models");
const { Sequelize } = require("sequelize");

const getSupervisorStockSummary = async (req, res) => {
  try {
    const totalStockIn = (await StockIn.sum("quantity")) || 0;
    const totalStockOut = (await StockHistory.sum("quantity")) || 0;

    // Total stock (stock-in + stock-out)
    const totalStock = totalStockIn + totalStockOut;

    // Menghitung persentase hanya jika totalStock > 0
    const stockInPercentage =
      totalStock > 0 ? (totalStockIn / totalStock) * 100 : 0;
    const stockOutPercentage =
      totalStock > 0 ? (totalStockOut / totalStock) * 100 : 0;

    res.json({
      stockIn: totalStockIn,
      stockOut: totalStockOut,
      stockInPercentage: stockInPercentage.toFixed(2), // Format ke 2 desimal
      stockOutPercentage: stockOutPercentage.toFixed(2), // Format ke 2 desimal
    });
  } catch (error) {
    console.error("Error fetching total stock-in and stock-out data:", error);
    res
      .status(500)
      .json({ error: "Failed to get total stock-in and stock-out data" });
  }
};

const getStockPerformance = async (req, res) => {
  try {
    // Produk yang paling cepat terjual
    const fastSellingProduct = await StockHistory.findOne({
      attributes: [
        "productId",
        [Sequelize.fn("SUM", Sequelize.col("quantity")), "total_sold"],
      ],
      include: [
        { model: Product, as: "product", attributes: ["product_name"] },
      ],
      group: ["StockHistory.productId", "product.id"],
      order: [[Sequelize.literal("total_sold"), "DESC"]],
      limit: 1,
    });

    // Waktu rata-rata habisnya stok
    const avgStockDurationData = await StockOut.findAll({
      attributes: [
        "productId",
        [
          Sequelize.fn(
            "AVG",
            Sequelize.literal(
              `EXTRACT(DAY FROM (CURRENT_DATE - "StockOut"."createdAt"))`
            )
          ),
          "avg_duration",
        ],
      ],
      include: [
        { model: Product, as: "product", attributes: ["product_name"] },
      ],
      group: ["StockOut.productId", "product.id"],
      order: [[Sequelize.literal("avg_duration"), "ASC"]],
      limit: 1,
    });

    // Produk yang paling jarang terjual
    const slowSellingProduct = await StockHistory.findOne({
      attributes: [
        "productId",
        [Sequelize.fn("SUM", Sequelize.col("quantity")), "total_sold"],
      ],
      include: [
        { model: Product, as: "product", attributes: ["product_name"] },
      ],
      group: ["StockHistory.productId", "product.id"],
      order: [[Sequelize.literal("total_sold"), "ASC"]],
      limit: 1,
    });

    // Mengirimkan data dalam response JSON
    res.json({
      fastSellingProduct: fastSellingProduct
        ? {
            name: fastSellingProduct.product.product_name,
            totalSold: fastSellingProduct.dataValues.total_sold,
          }
        : { name: "N/A", totalSold: 0 },
      avgStockDuration: avgStockDurationData.length
        ? {
            name: avgStockDurationData[0].product.product_name,
            avgDuration: Math.round(
              avgStockDurationData[0].dataValues.avg_duration
            ),
          }
        : { name: "N/A", avgDuration: 0 },
      slowSellingProduct: slowSellingProduct
        ? {
            name: slowSellingProduct.product.product_name,
            totalSold: slowSellingProduct.dataValues.total_sold,
          }
        : { name: "N/A", totalSold: 0 },
    });
  } catch (error) {
    console.error("Error fetching stock performance data:", error);
    res.status(500).json({ error: "Failed to get stock performance data" });
  }
};

module.exports = {
  getSupervisorStockSummary,
  getStockPerformance,
};
