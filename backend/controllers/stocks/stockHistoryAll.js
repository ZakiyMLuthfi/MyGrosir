const { StockHistory, Supplier, Product } = require("../../models");

const stockHistoryAll = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 5;
    const page = parseInt(req.query.page) || 1;

    const offset = (page - 1) * limit;

    // Mengambil data StockHistory dengan pagination
    const { count, rows: stockHistories } = await StockHistory.findAndCountAll({
      limit: limit,
      offset: offset,
      include: [
        { model: Supplier, as: "supplier" },
        { model: Product, as: "product" },
      ],
    });

    const totalPages = Math.ceil(count / limit);

    res.status(200).json({
      stockHistories,
      totalPages,
      currentPage: page,
      totalItems: count,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error fetching stock history list", err });
  }
};

module.exports = stockHistoryAll;
