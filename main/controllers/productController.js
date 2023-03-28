const fs = require("fs");

// controller to get all products
exports.getProducts = (req, res) => {
	const products = JSON.parse(fs.readFileSync("../data/products.json"));
	res.json(products);
};

// controller to get a product by its id
exports.getProductById = (req, res) => {
	const products = JSON.parse(fs.readFileSync("../data/products.json"));
	const { id } = req.params;
	const product = products.find((p) => p.id === id);
	if (product) {
		res.json(product);
	} else {
		res.status(404).json({ message: "Produit non trouvé" });
	}
};
