const { Product } = require("../../models");
const { Op } = require("sequelize");

const productAll = async (req, res) => {
  try {
    const limit = parseInt(req.query.itemsPerPage) || 5;
    const page = parseInt(req.query.page) || 1;
    const search = req.query.search || "";

    const offset = (page - 1) * limit;

    const whereCondition = {
      ...(search && { product_name: { [Op.iLike]: `%${search}%` } }),
    };

    const { count, rows: products } = await Product.findAndCountAll({
      where: whereCondition,
      limit: limit,
      offset: offset,
      order: [["updatedAt", "DESC"]],
    });

    console.log("Query Conditions:", whereCondition);
    const totalPages = Math.ceil(count / limit);

    res.status(200).json({
      products,
      totalPages,
      currentPage: page,
      totalItems: count,
    });
  } catch (err) {
    res.status(500).json({ error: "Error fetching products" });
  }
};

module.exports = productAll;
