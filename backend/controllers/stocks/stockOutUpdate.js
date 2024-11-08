// Menyesuaikan stockOutUpdate untuk menerima parameter langsung, tanpa req.params
const {
  StockOut,
  StockIn,
  StockHistory,
  Supplier,
  Product,
} = require("../../models");

const stockOutUpdate = async (
  id,
  quantity_reduction,
  stock_code,
  receipt_code,
  grosir_choice,
  userId
) => {
  const validGrosirChoices = ["Grosir A", "Grosir B", "Grosir C"];
  if (!validGrosirChoices.includes(grosir_choice)) {
    throw new Error("Invalid grosir choice");
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
      throw new Error("StockOut not found");
    }

    if (quantity_reduction < 1) {
      throw new Error("Quantity reduction cannot negative or zero");
    }

    const newQuantityRemaining =
      stockOut.quantity_remaining - quantity_reduction;

    if (newQuantityRemaining < 0) {
      throw new Error("Quantity reduction exceeds remaining quantity");
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
      stock_code: stock_code || stockOut.stock_code,
      receipt_code: receipt_code || stockOut.receipt_code,
      supplierId: stockOut.supplierId,
      productId: stockOut.productId,
      stockOutId: stockOut.id,
      supplier_name: stockOut.supplier ? stockOut.supplier.name : "Unknown",
      product_name: stockOut.product ? stockOut.product.name : "Unknown",
      quantity: quantity_reduction,
      stock_price,
      grosir_choice,
      created_by: userId,
      createdAt: new Date(),
    };

    console.log("StockHistoryData:", stockHistoryData);

    await StockHistory.create(stockHistoryData);

    return { stockOut, stockIn, stockHistoryData };
  } catch (err) {
    console.error(err);
    throw new Error("An error occurred while updating stock");
  }
};

module.exports = stockOutUpdate;
