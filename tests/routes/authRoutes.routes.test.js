const request = require('supertest');
const express = require('express');
const authRouter = require('../../main/routes/authRoutes.routes');

const app = express();
app.use(express.json());
app.use('/auth', authRouter);

describe('authRouter', () => {
  describe('POST /signup', () => {
    it('should return 400 if email is already taken', async () => {
      const email = 'test@example.com';
      // Mock the checkEmailDuplicate middleware to always return an error
      authRouter.stack[1].handle = (req, res, next) => {
        next({ status: 400, message: 'Email already taken' });
      };
      const res = await request(app)
        .post('/auth/signup')
        .send({ email, password: 'test123' });
      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Email already taken');
    });

    it('should return 200 and token if user is successfully created', async () => {
      const email = 'test@example.com';
      // Mock the checkEmailDuplicate middleware to not return an error
      authRouter.stack[1].handle = (req, res, next) => {
        next();
      };
      const res = await request(app)
        .post('/auth/signup')
        .send({ email, password: 'test123' });
      expect(res.status).toBe(200);
      expect(res.body.token).toBeDefined();
    });
  });

  describe('DELETE /', () => {
    it('should return 401 if user is not authenticated', async () => {
      const res = await request(app).delete('/auth');
      expect(res.status).toBe(401);
      expect(res.body.error).toBe('Unauthorized');
    });

    it('should return 204 if user is authenticated and account is deleted', async () => {
      // Mock the isAuth middleware to always call the next function
      authRouter.stack[2].handle = (req, res, next) => {
        req.user = { id: 'test-user-id' };
        next();
      };
      const res = await request(app)
        .delete('/auth')
        .set('Authorization', 'Bearer test-token');
      expect(res.status).toBe(204);
      expect(res.body).toEqual({});
    });
  });
});
