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

  describe('Helper Functions', () => {
    describe('Helper function to check if a user already exists', () => {
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
  });

  describe('/POST', () => {

    describe('Creating a new user', () => {
      // Write tests for the POST endpoint to create a new user without a firstname
      it('should return a 400 error if firstname, lastname, email or password is not provided', async () => {
        const payload = {
          lastname: 'test lastname goes here',
          email: 'testemail@gmail.com',
          role: 'REGULAR',
          password: 'testpassword@12345'
        };
        const response = await request(server)
          .post('/api/v1/users/store')
          .send(payload);

        expect(response).not.toBeNull();
        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('message');
        expect(response.body).toHaveProperty('data');
        expect(response.body.data).toMatchObject(payload);
      }, 30000);

      // Write tests for the POST endpoint to create a new user with a password of less than 6 characters
      it('should return a 400 error if password is less than six (6) characters', async () => {
        const payload = {
          firstname: 'test firstname goes here',
          lastname: 'test lastname goes here',
          email: 'testemail@gmail.com',
          role: 'REGULAR',
          password: 'test'
        };
        const response = await request(server)
          .post('/api/v1/users/store')
          .send(payload);

        expect(response).not.toBeNull();
        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('message');
        expect(response.body).toHaveProperty('data');
        expect(response.body.data).toMatchObject(payload);
      }, 30000);

      // Testcase for when a user already exists
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
          .post('/api/v1/users/store')
          .send(payload);

        expect(response).not.toBeNull();
        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('message', 'User already exists');
        expect(response.body).toHaveProperty('data');
        expect(response.body.data).toMatchObject(payload);
      }, 30000);

      // Testcase for successful creation of a user
      it('should return a 201 if the user details are of the correct format', async () => {
        const payload = {
          firstname: 'test firstname goes here',
          lastname: 'test lastname goes here',
          email: 'testemail@gmail.com',
          password: 'test@password'
        };
        const response = await request(server)
          .post('/api/v1/users/store')
          .send(payload);

        expect(response).not.toBeNull();
        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('message');
        expect(response.body).toHaveProperty('data');
        expect(response.body.data).toHaveProperty('_id');
      }, 30000);
    });

    describe('Logging in a user', () => {

      // Write testcase for when the user did not enter an email or password
      it('should return a 400 error if some data is missing in the payload', async () => {
        const payload = {
          email: 'testemail@gmail.com'
        };
        const response = await request(server)
          .post('/api/v1/users/auth')
          .send(payload);

        expect(response).not.toBeNull();
        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('message');
        expect(response.body).toHaveProperty('data');
        expect(response.body.data).toMatchObject(payload);
      }, 30000);

      it('should return a 404 error if no user is found for the payload', async () => {

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

        const payload = {
          email: 'no_such_email@gmail.com',
          password: 'no_such_password'
        };
        const response = await request(server)
          .post('/api/v1/users/auth')
          .send(payload);

        expect(response).not.toBeNull();
        expect(response.status).toBe(404);
        expect(response.body).toHaveProperty('message', 'Invalid Email or Password');
        expect(response.body).toHaveProperty('data');
        expect(response.body.data).toMatchObject(payload);
      }, 30000);

      it('should return a 404 error if the payload email is found but password not found', async () => {

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

        const payload = {
          email: 'email@gmail.com',
          password: 'no_such_password'
        };
        const response = await request(server)
          .post('/api/v1/users/auth')
          .send(payload);

        expect(response).not.toBeNull();
        expect(response.status).toBe(404);
        expect(response.body).toHaveProperty('message', 'Invalid Email or Password');
        expect(response.body).toHaveProperty('data');
        expect(response.body.data).toMatchObject(payload);
      }, 30000);

      it('should log in the user if the payload is authenticated and verified', async () => {

        const testPayload = {
          firstname: 'test firstname goes here',
          lastname: 'test lastname goes here',
          email: 'testemail@gmail.com',
          password: 'test@password'
        };
        const testResult = await request(server)
          .post('/api/v1/users/store')
          .send(testPayload);

        const payload = {
          email: 'testemail@gmail.com',
          password: 'test@password'
        };
        const response = await request(server)
          .post('/api/v1/users/auth')
          .send(payload);

        expect(response).not.toBeNull();
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('message', 'Login successful');
        expect(response.body).toHaveProperty('data');
        expect(response.body.data).toHaveProperty('_id');
        expect(response.body.data).toHaveProperty('role');
        expect(response.body.data).toHaveProperty('email', payload.email);
        expect(response.body.data).toHaveProperty('role');
      }, 30000);

    });

  });

  describe('/GET', ()=>{
    describe('Getting All Users', ()=>{
      it('should return a 401 error, a corresponding message and a data value of null when no token is provided', async ()=>{
        const response = await request(server).get('/api/v1/users');
        expect(response).not.toBeNull();
        expect(response.status).toBe(401);
        expect(response.body).toHaveProperty('message');
        expect(response.body).toHaveProperty('data');
        expect(response.body.message).toMatch('token');
        expect(response.body.data).toBe(null);
      }, 30000)
    })
  });

});