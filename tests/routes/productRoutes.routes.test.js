const request = require('supertest');
const express = require('express');
const productRouter = require('../../main/routes/productRouter.routes');

// Create a mock product controller for testing
const mockProductController = {
  getProducts: jest.fn(),
  getProductById: jest.fn(),
};

// Create a mock auth middleware for testing
const mockAuthMiddleware = jest.fn((req, res, next) => {
  // Simulate authentication by adding a user property to the request object
  req.user = { id: 123 };
  next();
});

// Create a mock Express app and use the product router
const app = express();
app.use('/products', productRouter);

// Test the GET /products endpoint with authentication
test('GET /products with auth', async () => {
  // Mock the product controller to return some data
  const products = [{ id: 1, name: 'Product 1' }, { id: 2, name: 'Product 2' }];
  mockProductController.getProducts.mockReturnValue(products);

  // Send a GET request to the /products endpoint with authentication
  const response = await request(app)
    .get('/products')
    .set('Authorization', 'Bearer mytoken');

  // Check that the response status code is 200 OK
  expect(response.statusCode).toBe(200);

  // Check that the product controller was called with the authenticated user ID
  expect(mockProductController.getProducts).toHaveBeenCalledWith(123);

  // Check that the response body contains the expected products
  expect(response.body).toEqual(products);
});

// Test the GET /products/:id endpoint with authentication
test('GET /products/:id with auth', async () => {
  // Mock the product controller to return some data
  const product = { id: 1, name: 'Product 1' };
  mockProductController.getProductById.mockReturnValue(product);

  // Send a GET request to the /products/:id endpoint with authentication
  const response = await request(app)
    .get('/products/1')
    .set('Authorization', 'Bearer mytoken');

  // Check that the response status code is 200 OK
  expect(response.statusCode).toBe(200);

  // Check that the product controller was called with the authenticated user ID and product ID
  expect(mockProductController.getProductById).toHaveBeenCalledWith(123, '1');

  // Check that the response body contains the expected product
  expect(response.body).toEqual(product);
});

// Test the GET /products endpoint without authentication
test('GET /products without auth', async () => {
  // Send a GET request to the /products endpoint without authentication
  const response = await request(app).get('/products');

  // Check that the response status code is 401 Unauthorized
  expect(response.statusCode).toBe(401);

  // Check that the response body contains an error message
  expect(response.body).toEqual({ message: 'Unauthorized' });

  // Check that the product controller and auth middleware were not called
  expect(mockProductController.getProducts).not.toHaveBeenCalled();
  expect(mockAuthMiddleware).not.toHaveBeenCalled();
});
