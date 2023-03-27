const express = require("express");
const router = express.Router();
const {
	getProducts,
	getProductById
} = require("../controllers/productController");
const { isAuth } = require("../middlewares/authMiddleware");

router.get("/", [isAuth], getProducts);
router.get("/:id", [isAuth], getProductById);

module.exports = router;
