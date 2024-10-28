const { StockIn, StockOut, Supplier, Product } = require("../../models");
const validateStockIn = require("../../validators/stockInValidator");

const stockInAdd = async (req, res) => {
  const { supplierId, productId, quantity, purchase_price, created_by } =
    req.body;

  const { isValid, errors } = validateStockIn(req.body);
  if (!isValid) {
    return res.status(400).json({
      errors,
    });
  }

  try {
    // Ambil data supplier dan product berdasarkan ID yang diberikan
    const supplier = await Supplier.findByPk(supplierId);
    const product = await Product.findByPk(productId);

    if (!supplier || !product) {
      return res.status(404).json({ error: "Supplier or product not found" });
    }

    const quantity_remaining = quantity;
    const total_purchase_price = purchase_price * quantity;

    const newStockInData = {
      stock_code: "S00001",
      supplierId,
      productId,
      quantity,
      quantity_remaining,
      purchase_price,
      total_purchase_price,
      created_by,
    };

    const newStockIn = await StockIn.create(newStockInData);

    const stockOutData = {
      stock_code: newStockIn.stock_code,
      stockInId: newStockIn.id,
      supplierId,
      productId,
      quantity,
      quantity_remaining: Number(quantity),
      purchase_price,
      total_purchase_price,
      created_by,
      updated_by: created_by,
    };

    const newStockOut = await StockOut.create(stockOutData);
    res.status(200).json({ newStockIn, newStockOut });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "An error occured while adding stock" });
  }
};
module.exports = stockInAdd;
