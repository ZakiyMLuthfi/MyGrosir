const { Supplier, User } = require("../../models");
const { Op } = require("sequelize");

const supplierAll = async (req, res) => {
  try {
    console.log("supplierAll: Called");
    const allData = req.query.allData === "true";
    const limit = allData ? null : parseInt(req.query.itemsPerPage) || 10;
    const page = allData ? null : parseInt(req.query.page) || 1;
    const search = req.query.search || "";

    // Logging untuk memeriksa parameter
    console.log("Request parameters:", { allData, limit, page, search });

    const offset = allData ? null : (page - 1) * limit;

    const whereCondition = {
      ...(req.user.role === "admin" && { isDeleted: false }),
      ...(search && {
        [Op.or]: [
          { supplier_name: { [Op.iLike]: `%${search}%` } },
          { supplier_code: { [Op.iLike]: `%${search}%` } },
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

    const { count, rows: suppliers } = await Supplier.findAndCountAll(
      queryOptions
    );

    console.log("Suppliers data retrieved:", suppliers);

    const totalPages = allData ? 1 : Math.ceil(count / limit);

    res.status(200).json({
      suppliers,
      totalPages,
      currentPage: page,
      totalItems: count,
    });
  } catch (err) {
    console.error("Error fetching suppliers:", err);
    res.status(500).json({ error: "Error fetching suppliers" });
  }
};

module.exports = supplierAll;
