const { Supplier } = require("../../models");
const validateSupplier = require("../../validators/supplierValidator");

const supplierUpdate = async (req, res) => {
  const { id } = req.params;
  const {
    supplier_name,
    supplier_address,
    supplier_contact_name,
    supplier_contact,
    goods_type,
    updated_by,
  } = req.body;

  const { isValid, errors } = validateSupplier(req.body);

  if (!isValid) {
    return res.status(400).json({ errors });
  }

  try {
    const supplier = await Supplier.findByPk(id);
    if (!supplier) {
      return res.status(400).json({ error: "Supplier not found" });
    }
    supplier.supplier_name = supplier_name;
    supplier.supplier_address = supplier_address;
    supplier.supplier_contact_name = supplier_contact_name;
    supplier.supplier_contact = supplier_contact;
    supplier.goods_type = Array.isArray(goods_type) ? goods_type : [goods_type];
    supplier.updated_by = updated_by;
    supplier.updateAt = new Date();

    await supplier.save();
    res.status(200).json(supplier);
  } catch (err) {
    console.error("Error updating supplier", err);
    res.status(500).json({ error: "Error updating supplier" });
  }
};

module.exports = supplierUpdate;
