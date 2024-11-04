const { Supplier } = require("../../models");

const supplierDelete = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;
  try {
    const supplier = await Supplier.findByPk(id, {
      where: {
        isDeleted: false,
      },
    });

    if (!supplier) {
      return res.status(400).json({ error: "Supplier not found" });
    }
    await supplier.update({ isDeleted: true, updated_by: userId }),
      res.status(200).json({ message: "Supplier deleted successfully" });
  } catch (err) {
    console.error("Error deleting supplier", err);
    res.status(500).json({ error: "Error deleting supplier" });
  }
};

const supplierRestore = async (req, res) => {
  const { id } = req.params;

  try {
    const supplier = await Supplier.findByPk(req.params.id, {
      where: {
        isDeleted: true,
      },
    });

    if (!supplier) {
      return res.status(400).json({ error: "Supplier not found" });
    }
    await supplier.update({ isDeleted: false }),
      res.status(200).json({ message: "Supplier restored successfuly" });
  } catch (err) {
    console.error("Error restoring supplier", err);
    res.status(500).json({ error: "Error restoring supplier" });
  }
};
module.exports = { supplierDelete, supplierRestore };
