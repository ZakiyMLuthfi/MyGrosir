const { User } = require("../models");
const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  console.log(
    "verifying token (from verifyToken): ",
    req.headers.authorization
  );

  const token = req.header("Authorization").replace("Bearer ", "");
  console.log("Extracted token:", token);
  if (!token) return res.status(401).json({ error: "Access Denied" });

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ error: "Token has expired" });
    }
    console.error("Invalid token error:", err);
    res.status(400).json({ error: "Invalid Token" });
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

const authorizeSuperAdmin = (req, res, next) => {
  if (req.user.role !== "superadmin") {
    return res.status(403).json({
      error: "Access denied. Only superadmin can perform this action.",
    });
  }
  next();
};

module.exports = { verifyToken, checkActiveStatus, authorizeSuperAdmin };
