const { Product, User } = require("../../models");
const { Op } = require("sequelize");

const productAll = async (req, res) => {
  try {
    const allData = req.query.allData === "true";
    const limit = allData ? null : parseInt(req.query.itemsPerPage) || 10;
    const page = allData ? null : parseInt(req.query.page) || 1;
    const search = req.query.search || "";

    const offset = allData ? null : (page - 1) * limit;

    const whereCondition = {
      ...(req.user.role === "admin" && { isDeleted: false }),
      ...(search && {
        [Op.or]: [
          { product_name: { [Op.iLike]: `%${search}%` } },
          { product_code: { [Op.iLike]: `%${search}%` } },
        ],
      }),
    };

    let queryOptions = {
      where: whereCondition,
      order: [["updatedAt", "DESC"]],
      include: [
        {
          model: User,
          as: "Creator",
          attributes: ["username"],
        },
        {
          model: User,
          as: "Updater",
          attributes: ["username"],
        },
      ],
    };

    if (!allData) {
      queryOptions = {
        ...queryOptions,
        limit,
        offset,
      };
    }

    const { count, rows: products } = await Product.findAndCountAll(
      queryOptions
    );

    console.log("Products with Creator and Updater:", products);
    const totalPages = allData ? 1 : Math.ceil(count / limit);

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
