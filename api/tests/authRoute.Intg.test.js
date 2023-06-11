import request from 'supertest';
import app from '../app.js';

describe('POST /api/auth/signup', () => {
  it('should create a new user and return user details with JWT token', async () => {
    try {
      const response = await request(app)
        .post('/api/auth/signup')
        .send({ email: 'test@example.com', password: '123456' });

      expect(response.status).toBe(200);
      expect(response.body.user).toBeDefined();
      expect(response.body.jwt).toBeDefined();
    } catch (error) {
      fail(error);
    }
  });

  it('should return an error if email is missing', async () => {
    try {
      const response = await request(app)
        .post('/api/auth/signup')
        .send({ password: '123456' });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Please enter your email address');
    } catch (error) {
      fail(error);
    }
  });

  it('should return an error if password is missing', async () => {
    try {
      const response = await request(app)
        .post('/api/auth/signup')
        .send({ email: 'test@example.com' });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Please enter your password');
    } catch (error) {
      fail(error);
    }
  });

  it('should return an error if email already exists', async () => {
    try {
      // Create a user with the same email before running the test
      await User.create({ email: 'existing@example.com', password: 'password123' });

      const response = await request(app)
        .post('/api/auth/signup')
        .send({ email: 'existing@example.com', password: '123456' });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Sorry, email already exists, please try again');
    } catch (error) {
      fail(error);
    }
  });

  it('should return an error if no request body is provided', async () => {
    try {
      const response = await request(app)
        .post('/api/auth/signup')
        .send();

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Please enter your email address');
    } catch (error) {
      fail(error);
    }
  });

  it('should return an error if invalid email address is provided', async () => {
    try {
      const response = await request(app)
        .post('/api/auth/signup')
        .send({ email: 'invalid_email', password: '123456' });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Please enter a valid email address');
    } catch (error) {
      fail(error);
    }
  });
});
