const jwt = require("jsonwebtoken");
const UserModel = require("../models/user");

const secretKey = process.env.ACCESS_TOKEN_SECRET;

// Check if the email is already in the database json file
exports.checkEmailDuplicate = async (req, res, next) => {
	try {
		const email = req.body.email;

		const user = await UserModel.findOne({ email });

		if (user) {
			return res.status(400).json({ message: "Email already exists" });
		}

		next();
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: error.message });
	}
};

// Check if the user is authenticated and its token is valid comparing it with the one in the database
exports.isAuth = async (req, res, next) => {
	try {
		// Get the token from the headers if it exists
		if (!req.headers.authorization) {
			return res
				.status(401)
				.json({ message: "A token must be provided in headers" });
		}

		let token = req.headers.authorization;

		// Remove the "Bearer" keyword from the token
		token = token.replace("Bearer ", "");

		const user = await UserModel.findOne({ token });

		if (!user) {
			return res.status(401).json({ message: "Unauthorized" });
		}

		next();
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: error.message });
	}
};
