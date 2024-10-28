const { StockIn } = require("../../models");

const stockInDetail = async (req, res) => {
  const { id } = req.params;

  try {
    const stockIn = await StockIn.findByPk(req.params.id);

    if (!stockIn) {
      return res.status(400).json({ error: "Stock-in not found" });
    }
    res.status(200).json(stockIn);
  } catch (err) {
    console.error("Error fetching stock-in details", err);
    res.status(500).json({ error: "Error fetching stock-in details" });
  }
};

module.exports = stockInDetail;
