const express = require("express");
const router = express.Router();
const {
  verifyToken,
  checkActiveStatus,
  checkUserStatus,
} = require("../middlewares/userVerify");
const userAll = require("../controllers/users/userAll");
const userAdd = require("../controllers/users/userAdd");
const userDetail = require("../controllers/users/userDetail");
const { userDelete, userRestore } = require("../controllers/users/userDelete");
const { login, logout } = require("../controllers/users/userLogin");
const {
  requestResetPassword,
  resetPassword,
  verifyResetToken,
} = require("../controllers/users/forgotPassword");

router.post("/login", login);
router.post("/logout", verifyToken, checkActiveStatus, logout);
router.get("/status", verifyToken, checkUserStatus);
router.get("/", userAll);
router.post("/", verifyToken, userAdd);
router.get("/:id", verifyToken, userDetail);
router.delete("/:id", verifyToken, userDelete);
router.put("/:id/restore", verifyToken, userRestore);

router.post("/request-reset-password", requestResetPassword);
router.post("/verify-reset-token", verifyResetToken);
router.post("/reset-password", resetPassword);

// router.put("/:id", userUpdate);
module.exports = router;
