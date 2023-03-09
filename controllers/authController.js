const fs = require("fs");
const AppError = require("../utils/appError");
const jwt = require("jsonwebtoken");
const QRCode = require("qrcode");
const nodemailer = require("nodemailer");

exports.signup = async (req, res, next) => {
	const email = req.body.email;

	try {
		// Create a jwt token
		const token = jwt.sign({ email }, process.env.JWT_SECRET, {
			expiresIn: process.env.JWT_EXPIRES_IN
		});

		//Create the QR code from the token
		const qr = await QRCode.toDataURL(token, { type: "image/png" });

		// Send the qr code to the user by email
		const transporter = nodemailer.createTransport({
			service: "hotmail",
			auth: {
				user: process.env.EMAIL,
				pass: process.env.PASSWORD
			}
		});

		const options = {
			from: process.env.EMAIL,
			to: email,
			subject: "QR Code d'authentification 2",
			html: `<p>Voici le QR Code d'authentification</p>
				   </br><img src="${qr}">`
		};

		await transporter.sendMail(options);
		console.log("Message sent");

		// Save email and the token into the json users file
		const users = JSON.parse(fs.readFileSync("data/users.json"));
		users.push({ email, token });
		fs.writeFileSync("data/users.json", JSON.stringify(users));
		console.log("User saved");

		res.status(201).json({ status: "success" });
	} catch (error) {
		console.log(error);
		res.status(500).json({ status: "error", message: error.message });
	}
};
