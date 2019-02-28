import 'babel-polyfill';
import request from 'supertest';
import UserModel from '../../models/user';
import {isUserUnique} from '../../api/v1/controllers/UserController';
import server from '../../index';

let app;

describe('/api/users', () => {

  beforeEach(() => {
    app = server;
  });

  afterEach(async (done) => {
    app.close();
    await UserModel.deleteMany({});
    done();
  });

  describe('/ User helper functions', () => {
    // Add test case for the isUserUnique() function
    it('should return true if the user is unique', async (done) => {
      // First, we seed the database with two random users
      await UserModel.collection.insertMany([
        {
          firstname: 'firstname goes here',
          lastname: 'lastname goes here',
          email: 'email@gmail.com',
          role: 'REGULAR',
          password: 'password@12345'
        },
        {
          firstname: 'another firstname goes here',
          lastname: 'another lastname goes here',
          email: 'anotheremail@gmail.com',
          role: 'REGULAR',
          password: 'anotherpassword@12345'
        }
      ]);

      // Then we make a call to the endpoint to create the a new users
      const payload = {
        firstname: 'test firstname goes here',
        lastname: 'test lastname goes here',
        email: 'testemail@gmail.com',
        role: 'REGULAR',
        password: 'testpassword@12345'
      };

      // Make a call to the isUserUnique method on the payload to check if the user is really unique
      const result = await isUserUnique(payload);
      expect(result).toBeTruthy();
      done();
    }, 30000);

    // Add test case for the isUserUnique() function
    it('should return false if the user is not unique', async (done) => {
      // First, we seed the database with two random users
      await UserModel.collection.insertMany([
        {
          firstname: 'firstname goes here',
          lastname: 'lastname goes here',
          email: 'email@gmail.com',
          role: 'REGULAR',
          password: 'password@12345'
        },
        {
          firstname: 'another firstname goes here',
          lastname: 'another lastname goes here',
          email: 'anotheremail@gmail.com',
          role: 'REGULAR',
          password: 'anotherpassword@12345'
        }
      ]);

      // Then we make a call to the endpoint to create the a new users
      const payload = {
        firstname: 'test firstname goes here',
        lastname: 'test lastname goes here',
        email: 'email@gmail.com',
        role: 'REGULAR',
        password: 'testpassword@12345'
      };
      const result = await isUserUnique(payload);
      expect(result).toBeFalsy();
      done();
    }, 30000);
  });

  describe('/POST', () => {
    // Write tests for the POST endpoint to create a new user without a firstname
    it('should return a 400 error if user validation fails', async () => {
      const payload = {
        lastname: 'test lastname goes here',
        email: 'testemail@gmail.com',
        role: 'REGULAR',
        password: 'testpassword@12345'
      };
      const response = await request(server)
        .post('/api/v1/user/store')
        .send(payload);

      expect(response).not.toBeNull();
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message');
      expect(response.body).toHaveProperty('data');
      expect(response.body.data).toMatchObject(payload);
    }, 30000);

    // Write tests for the POST endpoint to create a new user with a password of less than 6 characters
    it('should return a 400 error if user validation fails', async () => {
      const payload = {
        firstname: 'test firstname goes here',
        lastname: 'test lastname goes here',
        email: 'testemail@gmail.com',
        role: 'REGULAR',
        password: 'test'
      };
      const response = await request(server)
        .post('/api/v1/user/store')
        .send(payload);

      expect(response).not.toBeNull();
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message');
      expect(response.body).toHaveProperty('data');
      expect(response.body.data).toMatchObject(payload);
    }, 30000);
    it('should return a 400 error if user already exists', async () => {

      await UserModel.collection.insertMany([
        {
          firstname: 'firstname goes here',
          lastname: 'lastname goes here',
          email: 'email@gmail.com',
          password: 'password@12345'
        },
        {
          firstname: 'another firstname goes here',
          lastname: 'another lastname goes here',
          email: 'anotheremail@gmail.com',
          password: 'anotherpassword@12345'
        }
      ]);

      const payload = {
        firstname: 'test firstname goes here',
        lastname: 'test lastname goes here',
        email: 'email@gmail.com',
        password: 'test@password'
      };
      const response = await request(server)
        .post('/api/v1/user/store')
        .send(payload);

      expect(response).not.toBeNull();
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message', 'User already exists');
      expect(response.body).toHaveProperty('data');
      expect(response.body.data).toMatchObject(payload);
    }, 30000);

    it('should return a 201 if the user details are of the correct format', async () => {
      const payload = {
        firstname: 'test firstname goes here',
        lastname: 'test lastname goes here',
        email: 'testemail@gmail.com',
        password: 'test@password'
      };
      const response = await request(server)
        .post('/api/v1/user/store')
        .send(payload);

      console.log('RESPONSE: ', response.text);

      expect(response).not.toBeNull();
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('message');
      expect(response.body).toHaveProperty('data');
      expect(response.body.data).toHaveProperty('_id');
    }, 30000);
  });
});