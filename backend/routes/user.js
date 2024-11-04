const express = require("express");
const router = express.Router();
const {
  verifyToken,
  checkActiveStatus,
  authorizeSuperAdmin,
} = require("../middlewares/userVerify");

const userAll = require("../controllers/users/userAll");
const userAdd = require("../controllers/users/userAdd");
const userDetail = require("../controllers/users/userDetail");
const { userDelete, userRestore } = require("../controllers/users/userDelete");
const { login, logout } = require("../controllers/users/userLogin");

router.post("/login", login);
router.post("/logout", verifyToken, checkActiveStatus, logout);

router.get("/", verifyToken, userAll);
router.post("/", verifyToken, authorizeSuperAdmin, userAdd);
router.get("/:id", verifyToken, userDetail);
router.delete("/:id", verifyToken, authorizeSuperAdmin, userDelete);
router.put("/:id/restore", verifyToken, authorizeSuperAdmin, userRestore);

// router.put("/:id", userUpdate);
module.exports = router;
