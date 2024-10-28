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
  if (checks.integer && !val.isInt(field.toString(), { min: 1 })) {
    return `${fieldName} must be a positive number`;
  }

  return null;
};

const stockInValidator = (stockInData) => {
  const errors = [];

  if (typeof stockInData !== "object" || stockInData === null) {
    return { isValid: false, errors: ["Invalid data"] };
  }

  const fields = [
    { name: "supplierId", checks: { numeric: true, integer: true } },
    { name: "productId", checks: { numeric: true, integer: true } },
    { name: "quantity", checks: { numeric: true, integer: true } },
  ];

  fields.forEach(({ name, checks }) => {
    const error = validateField(
      stockInData[name],
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

module.exports = stockInValidator;
