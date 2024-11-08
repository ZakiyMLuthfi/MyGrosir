const { StockIn } = require("../../models"); // Sesuaikan dengan model Anda
const { Op } = require("sequelize");
const stockOutUpdate = require("../stocks/stockOutUpdate"); // Mengimpor fungsi yang sudah dimodifikasi

const batchReduce = async (req, res) => {
  try {
    const { productId, totalReduction, receipt_code, grosir_choice } = req.body;
    console.log("req body = ", req.body); // Log request body

    // Validasi input
    if (!Number.isInteger(productId) || !Number.isInteger(totalReduction)) {
      return res
        .status(400)
        .json({ error: "Invalid productId or totalReduction" });
    }

    let remainingReduction = totalReduction;

    // Ambil stok berdasarkan productId
    const stockIns = await StockIn.findAll({
      where: {
        productId,
        quantity_remaining: { [Op.gt]: 0 },
      },
      order: [["createdAt", "ASC"]],
    });

    console.log("Fetched stockIns: ", stockIns); // Log data stok yang diambil

    // Persiapkan data untuk update
    const updates = [];
    for (let stock of stockIns) {
      if (remainingReduction <= 0) break;

      const reductionAmount = Math.min(
        stock.quantity_remaining,
        remainingReduction
      );
      stock.quantity_remaining -= reductionAmount;
      remainingReduction -= reductionAmount;

      console.log(
        `Reducing by ${reductionAmount}, remaining: ${remainingReduction}`
      ); // Log pengurangan stok

      // Menyusun data untuk pengurangan stok
      updates.push({
        id: stock.id,
        quantity_reduction: reductionAmount,
        stock_code: stock.stock_code,
        receipt_code,
        grosir_choice,
      });

      await stock.save(); // Simpan stok setelah dikurangi
      console.log("Updated stock: ", stock); // Log stok setelah disimpan
    }

    if (remainingReduction > 0) {
      return res
        .status(400)
        .json({ error: "Not enough stock to fulfill the reduction" });
    }

    const userId = req.user.id; // Ambil userId dari request

    // Lakukan update satu per satu untuk setiap item di updates
    for (let update of updates) {
      const {
        id,
        quantity_reduction,
        stock_code,
        receipt_code,
        grosir_choice,
      } = update;

      // Lakukan update di stockOutUpdate untuk masing-masing ID dan stock_code
      try {
        const result = await stockOutUpdate(
          id,
          quantity_reduction,
          stock_code,
          receipt_code,
          grosir_choice,
          userId
        );
        console.log("StockOut Update Result: ", result);
      } catch (error) {
        console.error(`Error in updating stockOut for ID ${id}: `, error);
        return res.status(500).json({ error: error.message });
      }
    }

    res.status(200).json({ message: "Quantity reduced successfully" });
  } catch (error) {
    console.error("Error in batchReduce: ", error); // Log error secara rinci
    res.status(500).json({ error: error.message });
  }
};

module.exports = batchReduce;
