const { Product } = require("../../models");
const validateProduct = require("../../validators/productValidator");
const moment = require("moment-timezone");

const productAdd = async (req, res) => {
  const {
    product_name,
    package_quantity,
    weight_type, // kilogram, gram, liter, ml
    weight_per_pkg,
    description,
    created_by, //terisi otomatis
    updated_by, //terisi otomatis
  } = req.body;

  const { isValid, errors } = validateProduct(req.body);

  if (!isValid) {
    return res.status(400).json({ errors });
  }

  try {
    const existingProduct = await Product.findOne({
      where: { product_name },
    });

    if (existingProduct) {
      return res.status(400).json({ error: "Product name already exists" });
    }

    const weight = weight_per_pkg * package_quantity;

    const newProductData = {
      product_code: "P0000", // Nilai default yang akan diganti oleh hook
      product_name,
      package_quantity: Number(package_quantity),
      weight_type,
      weight: Number(weight),
      weight_per_pkg: Number(weight_per_pkg),
      description,
      created_by,
      updated_by,
    };

    const newProduct = await Product.create(newProductData);
    newProduct.dataValues.createdAt = moment(newProduct.createdAt)
      .tz("Asia/Bangkok")
      .format("YYYY-MM-DD HH:mm:ss");
    newProduct.dataValues.updatedAt = moment(newProduct.updatedAt)
      .tz("Asia/Bangkok")
      .format("YYYY-MM-DD HH:mm:ss");

    console.log("Product added", newProduct);
    res.status(201).json({ product: newProduct });
  } catch (err) {
    console.error("Error adding product", err);
    res.status(500).json({ error: "Error adding product" });
  }
};

module.exports = productAdd;
