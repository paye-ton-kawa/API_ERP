const express = require("express");
const AppError = require("./main/utils/appError");
const pathResolver = require("path");
require("dotenv").config();
const app = express();

// Configurations
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const mongoose = require("mongoose");
const UserModel = require("./main/models/user");

mongoose.connect(
	`mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.vg2og.mongodb.net/mydb?retryWrites=true&w=majority`,
	{
		useNewUrlParser: true,
		useUnifiedTopology: true
	}
);

mongoose.connection.on("error", (error) => {
	console.log(error);
});

mongoose.connection.once("open", async () => {
	console.log("Connected to database");

	const email = "test@test.com";
	const token =
		"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRlc3RAdGVzdC5jb20iLCJpYXQiOjE2ODAwMDUwNDR9.khmAARJjQjlnrBlasQ_wgMsLoFI5bY46BNstt8kdP2Q";

	const existingUser = await UserModel.findOne({ email });

	if (!existingUser) {
		const user = new UserModel({ email, token });
		await user.save();
		console.log("User created");
	} else {
		console.log("User already exists");
	}
});

// Routes
const authRoutes = require("./main/routes/authRoutes.routes");
const productRoutes = require("./main/routes/productRoutes.routes");

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/products", productRoutes);

app.get("/", (req, res) => {
	res.status(200).json({
		status: "success",
		message: "This is the auth route",
		routesList: [
			{
				route: "/api/v1/auth/signup",
				method: "POST",
				description: "Create a new user"
			},
			{
				route: "/api/v1/auth/login",
				method: "POST",
				description: "Login a user"
			}
		]
	});
});

// handle all the routes that are not defined
app.all("*", (req, res, next) => {
	next(new AppError(`The URL ${req.originalUrl} does not exists`, 404));
});

// Error handling middleware
const errorHandler = require("./main/utils/errorHandler");
app.use(errorHandler);

const PORT = process.env.PORT || 3000;

// Start the server
app.listen(PORT, () => {
	console.log(`Server started on port ${PORT}`);
});

module.exports = app;
