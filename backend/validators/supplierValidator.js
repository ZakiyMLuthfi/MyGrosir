const val = require("validator");

const validateField = (field, fieldName, checks) => {
  if (!field || val.isEmpty(field)) {
    return `${fieldName} is required`;
  }

  if (checks.alpha && !val.isAlpha(field.replace(/\s+/g, ""), "en-US")) {
    return `${fieldName} must contain only letters`;
  }

  if (checks.mobile && !val.isMobilePhone(field, "id-ID")) {
    return `${fieldName} must be a valid Indonesia number`;
  }

  return null; // Validasi berhasil
};

const supplierValidator = (supplierData) => {
  const errors = [];

  // Pastikan supplierData adalah objek yang valid
  if (typeof supplierData !== "object" || supplierData === null) {
    return { isValid: false, errors: ["Invalid data"] };
  }

  // Validasi field
  const fields = [
    { name: "supplier_name", checks: { alpha: true } },
    { name: "supplier_address", checks: {} },
    { name: "supplier_contact_name", checks: { alpha: true } },
    { name: "supplier_contact", checks: { mobile: true } },
  ];

  fields.forEach(({ name, checks }) => {
    const error = validateField(
      supplierData[name],
      name.replace("_", " "),
      checks
    );
    if (error) {
      errors.push(error);
    }
  });

  // Validasi goods_type
  if (
    !Array.isArray(supplierData.goods_type) ||
    supplierData.goods_type.length === 0
  ) {
    errors.push("Supplier's goods type is required");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

module.exports = supplierValidator;
