const express = require("express");
const AppError = require("./main/utils/appError");
const pathResolver = require("path");
require("dotenv").config();
const app = express();

// Configurations
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routes
const authRoutes = require("./main/routes/authRoutes.routes");
const productRoutes = require("./main/routes/productRoutes.routes");

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/products", productRoutes);

app.get("/api/v1/auth", (req, res) => {
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

// Start the server
app.listen(3000, () => {
	console.log("Server started on port 3000");
});

module.exports = app;
