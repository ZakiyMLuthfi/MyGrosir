const { Supplier } = require("../../models");
const validateSupplier = require("../../validators/supplierValidator");

const supplierAdd = async (req, res) => {
  const {
    supplier_name,
    supplier_address,
    supplier_contact_name,
    supplier_contact,
    goods_type,
    created_by,
    updated_by,
  } = req.body;

  const { isValid, errors } = validateSupplier(req.body);

  if (!isValid) {
    return res.status(400).json({ errors });
  }

  try {
    // Cek apakah supplier dengan nama yang sama sudah ada
    const existingSupplier = await Supplier.findOne({
      where: { supplier_name },
    });

    if (existingSupplier) {
      return res.status(400).json({ error: "Supplier name already exists" });
    }

    const newSupplierData = {
      supplier_code: "Sp0000", // Nilai default code supplier yang akan tergantikan
      supplier_name,
      supplier_address,
      supplier_contact_name,
      supplier_contact,
      goods_type,
      created_by,
      updated_by,
    };

    console.log("Supplier data akan mulai diproses: ", newSupplierData);

    const newSupplier = await Supplier.create(newSupplierData);

    console.log("Supplier added", newSupplier);
    res.status(201).json(newSupplier);
  } catch (err) {
    console.error("Error adding supplier", err);
    res.status(500).json({ error: "Error adding supplier" });
  }
};

module.exports = supplierAdd;
