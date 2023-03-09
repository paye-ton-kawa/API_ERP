const express = require("express");
const AppError = require("./utils/appError");

const app = express();

// Configurations
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routes
const authRoutes = require("./routes/authRoutes.routes");
const productRoutes = require("./routes/productRoutes.routes");

app.use("/api/v1/auth", authRoutes);
// app.use("/api/v1/products", productRoutes);

// handle all the routes that are not defined
app.all("*", (req, res, next) => {
	next(new AppError(`The URL ${req.originalUrl} does not exists`, 404));
});

// Error handling middleware
const errorHandler = require("./utils/errorHandler");
app.use(errorHandler);

// Start the server
app.listen(3000, () => {
	console.log("Server started on port 3000");
});

module.exports = app;
