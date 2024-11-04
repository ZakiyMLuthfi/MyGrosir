const { StockHistory, Product, User } = require("../../models");
const { Op } = require("sequelize");

const stockHistoryAll = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 5;
    const page = parseInt(req.query.page) || 1;
    const search = req.query.search || "";

    const offset = (page - 1) * limit;

    const whereCondition = {
      ...(search && {
        [Op.or]: [
          { "$product.product_name$": { [Op.iLike]: `%${search}%` } },
          { stock_code: { [Op.iLike]: `%${search}%` } },
          { grosir_choice: { [Op.iLike]: `%${search}%` } },
        ],
      }),
    };

    // Mengambil data StockHistory dengan pagination
    const { count, rows: stockHistories } = await StockHistory.findAndCountAll({
      where: whereCondition,
      limit: limit,
      offset: offset,
      include: [
        { model: Product, as: "product" },
        {
          model: User,
          as: "Creator",
          attributes: ["username"],
        },
      ],
      order: [["createdAt", "DESC"]],
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
