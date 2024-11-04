const { Product, User } = require("../../models");
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
      include: [
        {
          model: User,
          as: "Creator", // Alias untuk pengguna yang membuat
          attributes: ["username"], // Hanya ambil username
        },
        {
          model: User,
          as: "Updater", // Alias untuk pengguna yang mengupdate
          attributes: ["username"], // Hanya ambil username
        },
      ],
    });

    console.log("Products with Creator and Updater:", products);

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
