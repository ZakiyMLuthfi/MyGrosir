const { Product } = require("../../models");

const productDelete = async (req, res) => {
  const { id } = req.params;

  try {
    const product = await Product.findByPk(req.params.id, {
      where: {
        isDeleted: false,
      },
    });

    if (!product) {
      return res.status(400).json({ error: "Product not found" });
    }
    await product.update({ isDeleted: true }),
      res.status(200).json({ message: "Product deleted successfuly" });
  } catch (err) {
    console.error("Error deleting product", err);
    res.status(500).json({ error: "Error deleting product" });
  }
};

const productRestore = async (req, res) => {
  const { id } = req.params;

  try {
    const product = await Product.findByPk(req.params.id, {
      where: {
        isDeleted: true,
      },
    });

    if (!product) {
      return res.status(400).json({ error: "Product not found" });
    }
    await product.update({ isDeleted: false }),
      res.status(200).json({ message: "Product restored successfully" });
  } catch (err) {
    console.error("Error restoring product", err);
    res.status(500).json({ error: "Error restoring product" });
  }
};

module.exports = { productDelete, productRestore };
