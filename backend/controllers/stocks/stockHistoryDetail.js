const { StockHistory } = require("../../models");

const stockHistoryDetail = async (req, res) => {
  const { id } = req.params;

  try {
    const stockHistory = await StockHistory.findByPk(req.params.id);

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
