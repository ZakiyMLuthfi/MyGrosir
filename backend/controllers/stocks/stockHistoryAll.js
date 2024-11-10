const { StockHistory, Product, User } = require("../../models");
const { Op } = require("sequelize");

const stockHistoryAll = async (req, res) => {
  try {
    const allData = req.query.allData === "true"; // Cek jika allData true, ambil semua data
    const limit = allData ? null : parseInt(req.query.limit) || 10; // Jika allData, tidak ada limit
    const page = allData ? null : parseInt(req.query.page) || 1; // Jika allData, tidak ada paging
    const search = req.query.search || ""; // Pencarian berdasarkan nama produk atau kode resi

    const offset = allData ? null : (page - 1) * limit; // Paginasi offset jika allData false

    // Kondisi pencarian dengan menggunakan search
    const whereCondition = {
      ...(search && {
        [Op.or]: [
          { "$product.product_name$": { [Op.iLike]: `%${search}%` } }, // Pencarian berdasarkan nama produk
          { receipt_code: { [Op.iLike]: `%${search}%` } }, // Pencarian berdasarkan receipt_code
          { stock_code: { [Op.iLike]: `%${search}%` } },
          { grosir_choice: { [Op.iLike]: `%${search}%` } },
        ],
      }),
    };

    let queryOptions = {
      where: whereCondition,
      order: [["createdAt", "DESC"]], // Mengurutkan berdasarkan createdAt, terbaru pertama
      include: [
        { model: Product, as: "product" },
        {
          model: User,
          as: "Creator",
          attributes: ["username"],
        },
      ],
    };

    // Jika tidak mengambil semua data, tambahkan limit dan offset
    if (!allData) {
      queryOptions = {
        ...queryOptions,
        limit,
        offset,
      };
    }

    const { count, rows: stockHistories } = await StockHistory.findAndCountAll(
      queryOptions
    );

    const totalPages = allData ? 1 : Math.ceil(count / limit); // Menghitung total halaman jika ada paginasi

    res.status(200).json({
      stockHistories, // Mengembalikan data stock histories
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
