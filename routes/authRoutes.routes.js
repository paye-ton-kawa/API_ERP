const express = require("express");
const router = express.Router();
const { signup } = require("../controllers/authController");
const { checkEmailDuplicate } = require("../middlewares/authMiddlewares");

router.post("/signup", signup);

module.exports = router;
