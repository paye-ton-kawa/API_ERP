const fs = require('fs');
const jwt = require('jsonwebtoken');
const path = require('path');
const middleware = require('../../main/middlewares/authMiddleware');

describe('checkEmailDuplicate middleware', () => {
  let req, res, next;

  beforeEach(() => {
    req = { body: { email: 'newuser@test.com' } };
    res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    next = jest.fn();
  });

  test('should call next if email is not already in database', () => {
    jest.spyOn(fs, 'readFileSync').mockReturnValueOnce('[]');

    middleware.checkEmailDuplicate(req, res, next);

    expect(next).toHaveBeenCalled();
  });

  test('should return 400 if email is already in database', () => {
    const users = [{ email: 'existinguser@test.com' }];
    jest.spyOn(fs, 'readFileSync').mockReturnValueOnce(JSON.stringify(users));

    middleware.checkEmailDuplicate(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'Email already exists' });
  });
});

describe('isAuth middleware', () => {
  let req, res, next;

  beforeEach(() => {
    req = { headers: {} };
    res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    next = jest.fn();
  });

  test('should return 401 if no token is provided in headers', () => {
    middleware.isAuth(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'A token must be provided in headers' });
  });

  test('should return 401 if token is not found in database', () => {
    req.headers.authorization = 'Bearer invalid-token';
    jest.spyOn(fs, 'readFileSync').mockReturnValueOnce('[]');

    middleware.isAuth(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'Unauthorized' });
  });

  test('should call next if token is valid and found in database', () => {
    const token = jwt.sign({ email: 'test@test.com' }, {token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRlc3RAdGVzdC5jb20iLCJpYXQiOjE2ODAwMDUwNDR9.khmAARJjQjlnrBlasQ_wgMsLoFI5bY46BNstt8kdP2Q'});
    const users = [{ email: 'test@test.com', token }];
    req.headers.authorization = `Bearer ${token}`;
    jest.spyOn(fs, 'readFileSync').mockReturnValueOnce(JSON.stringify(users));

    middleware.isAuth(req, res, next);

    expect(next).toHaveBeenCalled();
  });
});
