const { StockIn, Supplier, Product, User } = require("../../models");
const { Op } = require("sequelize");

const stockInAll = async (req, res) => {
  try {
    const limit = parseInt(req.query.itemsPerPage) || 5;
    const page = parseInt(req.query.page) || 1;
    const search = req.query.search || "";

    const offset = (page - 1) * limit;

    const whereCondition = {
      ...(search && {
        [Op.or]: [
          { "$supplier.supplier_name$": { [Op.iLike]: `%${search}%` } },
          { "$product.product_name$": { [Op.iLike]: `%${search}%` } },
        ],
      }),
    };

    const { count, rows: stockIns } = await StockIn.findAndCountAll({
      where: whereCondition,
      limit: limit,
      offset: offset,
      order: [["updatedAt", "DESC"]],
      include: [
        { model: Supplier, as: "supplier", attributes: ["supplier_name"] },
        { model: Product, as: "product", attributes: ["product_name"] },
        {
          model: User,
          as: "Creator",
          attributes: ["username"],
        },
      ],
    });

    const totalPages = Math.ceil(count / limit);

    res.status(200).json({
      stockIns,
      totalPages,
      currentPage: page,
      totalItems: count,
    });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ error: "Error fetching stock-in list", message: err.message });
  }
};

module.exports = stockInAll;
