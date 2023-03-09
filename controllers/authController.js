const fs = require("fs");
const jwt = require("jsonwebtoken");
const QRCode = require("qrcode");

exports.signup = (req, res, next) => {
	const email = req.body.email;

	// Create a jwt token
	const token = jwt.sign({ email }, process.env.JWT_SECRET, {
		expiresIn: process.env.JWT_EXPIRES_IN
	});

	//Create the QR code from the token

	// Save email and the token into the json file

	res.status(201).json({
		status: "success",
		token,
		data: {
			email
		}
	});
};
