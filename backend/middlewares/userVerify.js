const { User } = require("../models");
const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  // Pastikan header authorization ada
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ error: "No token provided or invalid format" });
  }

  try {
    // Ekstrak token dari header
    const token = authHeader.replace("Bearer ", "");

    // Verifikasi token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(403).json({ error: "Invalid token" });
  }
};

const checkActiveStatus = async (req, res, next) => {
  const userId = req.user.id;

  try {
    const user = await User.findByPk(userId);
    console.log("User found:", user); // Tambahkan logging ini
    if (!user || !user.is_active) {
      return res.status(403).json({ error: "Access denied" });
    }
    next();
  } catch (error) {
    console.error("Error checking active status", error);
    res.status(500).json({ error: "An error occurred while checking status" });
  }
};

const checkUserStatus = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ status: "not_found" });
    }

    res.json({ status: user.is_active ? "active" : "deactivated" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const authorizeSuperAdmin = async (req, res, next) => {
  if (req.user.role !== "superadmin") {
    return res.status(403).json({
      error: "Access denied. Only superadmin can perform this action.",
    });
  }
  next();
};

module.exports = {
  verifyToken,
  checkActiveStatus,
  authorizeSuperAdmin,
  checkUserStatus,
};
