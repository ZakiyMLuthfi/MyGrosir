const { StockHistory } = require("../../models");
const { Op } = require("sequelize");

const getReceiptCodes = async (req, res) => {
  try {
    const search = req.query.search || "";

    const whereCondition = {
      ...(search && {
        receipt_code: { [Op.iLike]: `%${search}%` },
      }),
    };

    const receiptCodes = await StockHistory.findAll({
      where: whereCondition,
      attributes: ["receipt_code"],
      group: ["receipt_code"],
      order: [["updatedAt", "DESC"]],
    });

    res.status(200).json({ receiptCodes });
  } catch (err) {
    console.error("Error fetching receipt codes:", err);
    res.status(500).json({ error: "Error fetching receipt codes" });
  }
};

module.exports = getReceiptCodes;
