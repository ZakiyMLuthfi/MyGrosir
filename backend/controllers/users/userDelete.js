const { User } = require("../../models");

const userDelete = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findByPk(id, {
      where: {
        is_deleted: false,
      },
    });

    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }
    await user.update({ is_deleted: true, is_active: false }),
      res.status(200).json({ message: "User deleted successfuly" });
  } catch (err) {
    console.error("Error deleting user", err);
    res.status(500).json({ error: "Error deleting User" });
  }
};

const userRestore = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findByPk(id, {
      where: {
        is_deleted: true,
      },
    });

    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }
    await user.update({ is_deleted: false }),
      res.status(200).json({ message: "User restored successfully" });
  } catch (err) {
    console.error("Error restoring User", err);
    res.status(500).json({ error: "Error restoring User" });
  }
};

module.exports = { userDelete, userRestore };
