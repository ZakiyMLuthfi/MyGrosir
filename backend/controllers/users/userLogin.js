const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { User } = require("../../models");

const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ where: { username } });

    if (!user || user.is_deleted) {
      return res
        .status(404)
        .json({ error: "User not found or account inactive" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    console.log("Is password valid", isPasswordValid);

    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    if (!user.is_active) {
      await User.update({ is_active: true }, { where: { id: user.id } });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "12h" }
    );

    res.status(200).json({ token });
  } catch (error) {
    console.error("Error during login", error);
    res.status(500).json({ error: "An error occurred during login" });
  }
};

const logout = async (req, res) => {
  const userId = req.user.id;

  try {
    const user = await User.findByPk(userId);
    if (user) {
      await User.update({ is_active: false }, { where: { id: userId } });
      res.status(200).json({ message: "User logged out successfully" });
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    console.error("Error during logout", error);
    res.status(500).json({ error: "An error occurred during logout" });
  }
};

module.exports = { login, logout };
