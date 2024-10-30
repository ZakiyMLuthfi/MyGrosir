const { StockIn, Supplier, Product } = require("../../models");

const stockInDetail = async (req, res) => {
  const { id } = req.params;

  try {
    const stockIn = await StockIn.findByPk(id, {
      include: [
        {
          model: Supplier,
          as: "supplier",
          attributes: ["supplierId", "supplier_code", "supplier_name"],
        },
        {
          model: Product,
          as: "product",
          attributes: ["productId", "product_code", "product_name"],
        },
      ],
    });

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
