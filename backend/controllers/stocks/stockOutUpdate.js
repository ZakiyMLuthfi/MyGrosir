const {
  StockOut,
  StockIn,
  StockHistory,
  Supplier,
  Product,
} = require("../../models");

const stockOutUpdate = async (req, res) => {
  const { id } = req.params;
  const { quantity_reduction, grosir_choice } = req.body;

  const userId = req.user.id;

  const validGrosirChoices = ["Grosir A", "Grosir B", "Grosir C"];
  if (!validGrosirChoices.includes(grosir_choice)) {
    return res.status(400).json({ error: "Invalid grosir choice" });
  }
  try {
    const stockOut = await StockOut.findByPk(id, {
      include: [
        {
          model: Supplier,
          as: "supplier",
        },
        {
          model: Product,
          as: "product",
        },
      ],
    });

    if (!stockOut) {
      return res(404).json({ error: "StockOut not found" });
    }

    if (quantity_reduction < 1) {
      return res
        .status(400)
        .json({ error: "Quantity reduction cannot negative or zero" });
    }
    const newQuantityRemaining =
      stockOut.quantity_remaining - quantity_reduction;

    if (newQuantityRemaining < 0) {
      return res
        .status(400)
        .json({ error: "Quantity reduction exceeds remaining quantity" });
    }
    await StockOut.update(
      {
        quantity_remaining: newQuantityRemaining,
        updated_by: userId,
        updatedAt: new Date(),
      },
      {
        where: { id: stockOut.id },
      }
    );

    const stockIn = await StockIn.findByPk(stockOut.stockInId);
    await stockIn.update({
      quantity_remaining: newQuantityRemaining,
    });

    const stock_price = stockIn.purchase_price * quantity_reduction;
    const stockHistoryData = {
      stock_code: stockOut.stock_code,
      supplierId: stockOut.supplierId,
      productId: stockOut.supplierId,
      stockOutId: stockOut.id,
      supplier_name: stockOut.supplier.name, // relasi diambil dari Supplier
      product_name: stockOut.product.name, // relasi diambil dari Product
      quantity: quantity_reduction,
      stock_price,
      grosir_choice,
      created_by: userId,
      createdAt: new Date(),
    };

    console.log("StockHistoryData adalaH:", stockHistoryData);

    await StockHistory.create(stockHistoryData);

    return res.status(200).json({ stockOut, stockIn, stockHistoryData });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ error: "An error occured while updating stock" });
  }
};

module.exports = stockOutUpdate;
