const express = require("express");
const router = express.Router();
const { signup, deleteUser } = require("../controllers/authController");
const {
	checkEmailDuplicate,
	isAuth
} = require("../middlewares/authMiddleware");

router
	.post("/signup", [checkEmailDuplicate], signup)
	.delete("/", [isAuth], deleteUser);

module.exports = router;
