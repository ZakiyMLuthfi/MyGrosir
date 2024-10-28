const { StockOut } = require("../../models");

const stockOutDetail = async (req, res) => {
  const { id } = req.params;

  try {
    const stockOut = await StockOut.findByPk(req.params.id);
    if (!stockOut) {
      return res.status(400).json({ error: "Stock-out not found" });
    }
    res.status(200).json(stockOut);
  } catch (err) {
    console.error("Error fetching stock-out details", err);
    res.status(500).json({ error: "Error fetching stock-out details" });
  }
};

module.exports = stockOutDetail;
