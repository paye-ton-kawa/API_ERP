const fs = require("fs");
const AppError = require("../utils/appError");
const jwt = require("jsonwebtoken");
const QRCode = require("qrcode");
const nodemailer = require("nodemailer");

exports.signup = async (req, res, next) => {
	const email = req.body.email;

	try {
		// Create a jwt token
		const token = jwt.sign({ email }, process.env.JWT_SECRET);

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
		const users = JSON.parse(
			fs.readFileSync(pathResolver.join("./main/data/users.json"))
		);
		users.push({ email, token });
		fs.writeFileSync("../data/users.json", JSON.stringify(users));
		console.log("User saved");

		res
			.status(201)
			.json({ status: "success", message: "QR Code sent", token: token });
	} catch (error) {
		console.log(error);
		res.status(500).json({ status: "error", message: error.message });
	}
};

exports.updateUser = async (req, res, next) => {
	// Get the email from the headers token decoded or the body
	try {
		if (req.headers.authorization) {
			let tokenHeader = req.headers.authorization;
			tokenHeader = tokenHeader.replace("Bearer ", "");
			const decoded = jwt.verify(
				req.headers.authorization,
				process.env.JWT_SECRET
			);
		}
		const email = decoded.email ? decoded.email : req.body.email;

		// Create a jwt token
		const token = jwt.sign({ email }, process.env.JWT_SECRET);

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
			subject: "Nouveau QR Code d'authentification",
			html: `<p>Voici le nouveau QR Code d'authentification</p>
				   </br><img src="${qr}">`
		};

		await transporter.sendMail(options);
		console.log("Message sent");

		// Delete the user token associated to the users email in the json file
		const users = JSON.parse(
			fs.readFileSync(pathResolver.join("./main/data/users.json"))
		);
		const filteredUsers = users.filter((user) => user.email !== email);
		fs.writeFileSync("../data/users.json", JSON.stringify(filteredUsers));
		console.log("User deleted");

		// Save email and the token into the json users file
		const newUsers = JSON.parse(fs.readFileSync("data/users.json"));
		newUsers.push({ email, token });
		fs.writeFileSync("../data/users.json", JSON.stringify(newUsers));
		console.log("User new token saved");

		res.status(201).json({
			status: "success",
			message: "QR Code sent and saved",
			token: "token"
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({ status: "error", message: error.message });
	}
};

// Delete a user from the json file using the token
exports.deleteUser = async (req, res, next) => {
	try {
		let token = req.headers.authorization;
		// remove the Bearer from the token
		token = token.replace("Bearer ", "");

		// decode the token to get the email
		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		const email = decoded.email;

		// Delete the user from the json file
		const users = JSON.parse(fs.readFileSync("data/users.json"));
		console.log(users);
		const filteredUsers = users.filter((user) => user.token !== token);
		console.log(filteredUsers);
		fs.writeFileSync("../data/users.json", JSON.stringify(filteredUsers));
		console.log("User deleted");

		res.status(200).json({ status: "success" });
	} catch (error) {
		console.log(error);
		res.status(500).json({ status: "error", message: error.message });
	}
};
