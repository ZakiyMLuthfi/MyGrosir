const { Supplier } = require("../../models");
const { Op } = require("sequelize");

const supplierAll = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 5;
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
    });

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
