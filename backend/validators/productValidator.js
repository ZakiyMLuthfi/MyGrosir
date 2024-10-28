const val = require("validator");

const validateField = (field, fieldName, checks) => {
  if (typeof field !== "string") {
    field = String(field);
  }
  if (!field || val.isEmpty(field)) {
    return `${fieldName} is required`;
  }

  if (checks.numeric && !val.isNumeric(field.toString())) {
    return `${fieldName} must be a valid number`;
  }
  if (checks.decimal && !val.isDecimal(field.toString())) {
    return `${fieldName} must be a valid decimal number`;
  }

  return null;
};

const productValidator = (productData) => {
  const errors = [];

  // Cek apakah product_name kosong
  if (typeof productData !== "object" || productData === null) {
    return { isValid: false, errors: ["Invalid data"] };
  }

  const fields = [
    { name: "product_name", checks: {} },
    { name: "package_quantity", checks: { numeric: true } },
    { name: "weight_per_pkg", checks: { decimal: true } },
  ];
  fields.forEach(({ name, checks }) => {
    const error = validateField(
      productData[name],
      name.replace("_", " "),
      checks
    );
    if (error) {
      errors.push(error);
    }
  });

  return {
    isValid: errors.length === 0,
    errors,
  };
};

module.exports = productValidator;
