const { Product } = require("../../models");
const validateProduct = require("../../validators/productValidator");

const productUpdate = async (req, res) => {
  const { id } = req.params;
  const { package_quantity, weight_per_pkg, description, updated_by } =
    req.body;

  const { isValid, errors } = validateProduct(req.body);

  if (!isValid) {
    return res.status(400).json({ errors });
  }

  try {
    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(400).json({ error: "Product not found" });
    }
    console.log("Received data:", {
      package_quantity,
      weight_per_pkg,
      description,
    });

    const weight = Number(weight_per_pkg) * Number(package_quantity);
    console.log("total weight dikonversi:", weight);

    const hasChanges =
      product.package_quantity !== Number(package_quantity) ||
      product.weight_per_pkg !== Number(weight_per_pkg) ||
      product.weight !== Number(weight) ||
      product.description !== description;

    if (!hasChanges) {
      return res.status(200).json({ message: "No changes made", product });
    }

    product.package_quantity = Number(package_quantity) || 1;
    product.weight_per_pkg = Number(weight_per_pkg) || 0;
    product.weight = weight;
    product.description = description;
    product.updated_by = updated_by;
    product.updatedAt = new Date();

    await product.save();

    res.status(200).json(product);
  } catch (err) {
    console.error("Error updating product", err);
    res.status(500).json({ error: "Error updating product" });
  }
};

module.exports = productUpdate;
