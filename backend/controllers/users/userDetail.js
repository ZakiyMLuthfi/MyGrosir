const { User } = require("../../models");

const userDetail = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findByPk(id, {
      where: {
        isDeleted: false,
      },
    });

    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }
    res.status(200).json(user);
  } catch (err) {
    console.error("Error fetching user details", err);
    res.status(500).json({ error: "Error fetching user details" });
  }
};

module.exports = userDetail;
