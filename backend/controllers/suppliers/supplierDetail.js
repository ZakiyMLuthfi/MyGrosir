const { Supplier } = require("../../models");

const supplierDetail = async (req, res) => {
  const { id } = req.params;

  try {
    const supplier = await Supplier.findByPk(req.params.id, {
      where: {
        isDeleted: false,
      },
    });

    if (!supplier) {
      return res.status(400).json({ error: "Supplier not found" });
    }
    res.status(200).json(supplier);
  } catch (err) {
    console.error("Error fetching supplier details", err);
    res.status(500).json({ error: "Error fetching supplier details" });
  }
};

module.exports = supplierDetail;
