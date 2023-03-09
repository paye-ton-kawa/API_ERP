const jwt = require("jsonwebtoken");

const secretKey = process.env.ACCESS_TOKEN_SECRET;

module.exports = (req, res, next) => {
	// Récupérer le jeton d'authentification depuis l'en-tête de la requête
	const token = req.headers.authorization;

	// Vérifier si le jeton existe
	if (!token) {
		return res.sendStatus(401);
		// return res.status(401);
	}

	try {
		// Vérifier si le jeton est valide
		const decoded = jwt.verify(token, secretKey);
		req.user = decoded; // Stocker les informations de l'utilisateur dans l'objet requête pour une utilisation ultérieure
		next(); // Passer au middleware suivant
	} catch (error) {
		return res.status(403).json({ message: "Unauthorized" });
	}
};
