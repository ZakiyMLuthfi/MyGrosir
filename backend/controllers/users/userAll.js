const { User } = require("../../models");
const { Op } = require("sequelize");

const userAll = async (req, res) => {
  try {
    const limit = parseInt(req.query.itemsPerPage) || 10;
    const page = parseInt(req.query.page) || 1;
    const search = req.query.search || "";

    const offset = (page - 1) * limit;

    const whereCondition = {
      ...(search && { username: { [Op.iLike]: `%${search}%` } }),
    };

    const { count, rows: users } = await User.findAndCountAll({
      where: whereCondition,
      limit: limit,
      offset: offset,
      order: [["updatedAt", "DESC"]],
    });

    const totalPages = Math.ceil(count / limit);

    res.status(200).json({
      users,
      totalPages,
      currentPage: page,
      totalItems: count,
    });
  } catch (err) {
    res.status(500).json({ error: "Error fetching user" });
  }
};

module.exports = userAll;
