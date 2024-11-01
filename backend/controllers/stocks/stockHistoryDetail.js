const { StockHistory, Supplier, Product } = require("../../models");

const stockHistoryDetail = async (req, res) => {
  const { id } = req.params;

  try {
    const stockHistory = await StockHistory.findByPk(id, {
      include: [
        {
          model: Supplier,
          as: "supplier",
          attributes: ["supplier_code", "supplier_name"],
        },
        {
          model: Product,
          as: "product",
          attributes: ["product_code", "product_name"],
        },
      ],
    });

    if (!stockHistory) {
      return res.status(400).json({ error: "Stock history not found" });
    }
    res.status(200).json(stockHistory);
  } catch (err) {
    console.error("Error fetching stock history details", err);
    res.status(500).json({ error: "Error fetching stock history details" });
  }
};

module.exports = stockHistoryDetail;
