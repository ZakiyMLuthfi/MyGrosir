const { Product } = require("../../models");

const productDetail = async (req, res) => {
  const { id } = req.params;

  try {
    const product = await Product.findByPk(id, {
      where: {
        isDeleted: false,
      },
    });

    if (!product) {
      return res.status(400).json({ error: "Product not found" });
    }

    res.status(200).json(product);
  } catch (err) {
    console.error("Error fetching product details", err);
    res.status(500).json({ error: "Error fetching product details" });
  }
};

module.exports = productDetail;
