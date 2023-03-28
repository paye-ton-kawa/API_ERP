// Import necessary modules and dependencies
const app = require('../../main/middlewares/authMiddleware');
const request = require('supertest');
const fs = require('fs');
const jwt = require('jsonwebtoken');
require('dotenv').config();


// Define the test for the checkEmailDuplicate middleware
describe('checkEmailDuplicate middleware', () => {
  // Define a mock user database
  const mockUsers = [    { id: 1, name: 'John', email: 'john@example.com', password: 'password123' },    { id: 2, name: 'Jane', email: 'jane@example.com', password: 'password456' }  ];
  
  // Create a temporary database file with the mock users
  beforeAll(() => {
    fs.writeFileSync('data/users.json', JSON.stringify(mockUsers));
  });

  // Delete the temporary database file after the tests are complete
  afterAll(() => {
    fs.unlinkSync('data/users.json');
  });

  // Test the middleware with a valid email
  it('should call the next middleware function when the email is not in the database', async () => {
    const res = await request(app)
      .post('/register')
      .send({ name: 'Bob', email: 'bob@example.com', password: 'password789' });

    expect(res.statusCode).toEqual(200);
  });

  // Test the middleware with an existing email
  it('should return a 400 error when the email is already in the database', async () => {
    const res = await request(app)
      .post('/register')
      .send({ name: 'Bob', email: 'john@example.com', password: 'password789' });

    expect(res.statusCode).toEqual(400);
    expect(res.body.message).toEqual('Email already exists');
  });
});

// Define the test for the isAuth middleware
describe('isAuth middleware', () => {
  // Define a mock user database
  const mockUsers = [    { id: 1, name: 'John', email: 'john@example.com', password: 'password123', token: jwt.sign({ userId: 1 }, process.env.JWT_SECRET) },    { id: 2, name: 'Jane', email: 'jane@example.com', password: 'password456', token: jwt.sign({ userId: 2 }, process.env.JWT_SECRET) }  ];
  
  // Create a temporary database file with the mock users
  beforeAll(() => {
    fs.writeFileSync('data/users.json', JSON.stringify(mockUsers));
  });

  // Delete the temporary database file after the tests are complete
  afterAll(() => {
    fs.unlinkSync('data/users.json');
  });

  // Test the middleware with a valid authorization header and token
  it('should call the next middleware function when the token is valid', async () => {
    const user = mockUsers[0];
    const token = user.token;
    const res = await request(app)
      .get('/protected')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toEqual(200);
  });

  // Test the middleware with an invalid authorization header
  it('should return a 401 error when the authorization header is missing', async () => {
    const res = await request(app)
      .get('/protected');

    expect(res.statusCode).toEqual(401);
    expect(res.body.message).toEqual('A token must be provided in headers');
  });

  // Test the middleware with an invalid authorization header
  it('should return a 401 error when the authorization header is missing', async () => {
    const res = await request(app)
      .get('/protected');

    expect(res.statusCode).toEqual(401);
    expect(res.body.message).toEqual('A token must be provided in headers');
  });

  // Test the middleware with an invalid token
  it('should return a 401 error when the token is invalid', async () => {
    const res = await request(app)
      .get('/protected')
      .set('Authorization', 'Bearer invalid_token');

    expect(res.statusCode).toEqual(401);
    expect(res.body.message).toEqual('Unauthorized');
  });

  // Test the middleware with a non-existent token
  it('should return a 401 error when the token does not match any user', async () => {
    const token = jwt.sign({ userId: 3 }, process.env.JWT_SECRET);
    const res = await request(app)
      .get('/protected')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toEqual(401);
    expect(res.body.message).toEqual('Unauthorized');
  });
});


