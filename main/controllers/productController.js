const fs = require("fs");

// controller to get all products
exports.getProducts = (req, res) => {
<<<<<<< HEAD
	const products = JSON.parse(
		fs.readFileSync(pathResolver.join("data/products.json"))
	);
=======
	const products = JSON.parse(fs.readFileSync("../data/products.json"));
>>>>>>> 109c2b2a45d65e937918e0cddc7fb6dfe556269a
	res.json(products);
};

// controller to get a product by its id
exports.getProductById = (req, res) => {
<<<<<<< HEAD
	const products = JSON.parse(
		fs.readFileSync(pathResolver.join("data/products.json"))
	);
=======
	const products = JSON.parse(fs.readFileSync("../data/products.json"));
>>>>>>> 109c2b2a45d65e937918e0cddc7fb6dfe556269a
	const { id } = req.params;
	const product = products.find((p) => p.id === id);
	if (product) {
		res.json(product);
	} else {
		res.status(404).json({ message: "Produit non trouvé" });
	}
};
