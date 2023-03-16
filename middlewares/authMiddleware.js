const jwt = require("jsonwebtoken");
const fs = require("fs");

const secretKey = process.env.ACCESS_TOKEN_SECRET;

// Check if the email is already in the database json file
exports.checkEmailDuplicate = (req, res, next) => {
	const email = req.body.email;
	const users = JSON.parse(fs.readFileSync("data/users.json"));

	// Check if the email is already in the database
	const user = users.find((user) => user.email === email);

	if (user) {
		return res.status(400).json({ message: "Email already exists" });
	}

	next();
};

// Check if the user is authenticated and its token is valid compraing it with the one in the database
exports.isAuth = (req, res, next) => {
	try {
		// Récupérer le jeton d'authentification depuis l'en-tête de la requête
		let token = req.headers.authorization;
		// Supprimer le mot clé "Bearer" du jeton
		token = token.replace("Bearer ", "");

		// Vérifier si le jeton existe
		if (!token) {
			return res
				.status(401)
				.json({ message: "A token must be provided in headers" });
		}

		const users = JSON.parse(fs.readFileSync("data/users.json"));
		const user = users.find((user) => user.token === token);

		if (!user) return res.status(401).json({ message: "Unauthorized" });

		next();
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: error.message });
	}
};
