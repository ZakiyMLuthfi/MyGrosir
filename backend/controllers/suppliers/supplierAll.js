const { Supplier, User } = require("../../models");
const { Op } = require("sequelize");

const supplierAll = async (req, res) => {
  try {
    const limit = parseInt(req.query.itemsPerPage) || 5;
    const page = parseInt(req.query.page) || 1;
    const search = req.query.search || "";

    const offset = (page - 1) * limit;

    const whereCondition = {
      ...(search && { supplier_name: { [Op.iLike]: `%${search}%` } }),
    };

    const { count, rows: suppliers } = await Supplier.findAndCountAll({
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

    console.log("Suppliers with Creator and Updater:", suppliers);
    const totalPages = Math.ceil(count / limit);

    res.status(200).json({
      suppliers,
      totalPages,
      currentPage: page,
      totalItems: count,
    });
  } catch (err) {
    res.status(500).json({ error: "Error fetching suppliers" });
  }
};

module.exports = supplierAll;
