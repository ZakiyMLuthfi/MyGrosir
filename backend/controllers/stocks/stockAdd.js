const { StockIn, StockOut, Supplier, Product } = require("../../models");
const validateStockIn = require("../../validators/stockInValidator");

const stockInAdd = async (req, res) => {
  const { supplierId, productId, quantity, purchase_price, created_by } =
    req.body;
  const userId = req.user.id;

  const { isValid, errors } = validateStockIn(req.body);
  if (!isValid) {
    return res.status(400).json({ errors });
  }

  try {
    // Ambil data supplier dan product
    const supplier = await Supplier.findByPk(supplierId);
    if (!supplier) {
      return res.status(404).json({ error: "Supplier not found" });
    }

    const product = await Product.findByPk(productId);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    const total_purchase_price = purchase_price * quantity;

    const newStockInData = {
      stock_code: "S00001",
      supplierId,
      productId,
      quantity,
      quantity_remaining: quantity,
      purchase_price,
      total_purchase_price,
      created_by: userId,
    };

    // Buat entry baru di StockIn
    const newStockIn = await StockIn.create(newStockInData);
    console.log("New StockIn ID:", newStockIn.id);

    // Buat entry baru di StockOut
    const stockOutData = {
      stock_code: newStockIn.stock_code,
      stockInId: newStockIn.id,
      supplierId,
      productId,
      quantity,
      quantity_remaining: Number(quantity),
      purchase_price,
      total_purchase_price,
      created_by: userId,
      updated_by: userId,
    };

    console.log("StockOut Data:", stockOutData);
    const newStockOut = await StockOut.create(stockOutData);
    console.log("New StockOut Created:", newStockOut.id);

    res.status(200).json({ newStockIn, newStockOut });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "An error occurred while adding stock" });
  }
};

module.exports = stockInAdd;
