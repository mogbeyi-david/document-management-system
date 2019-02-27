import app from '../../index';
import supertest from 'supertest';
import UserModel from '../../models/user';
import UserController from '../../api/v1/controllers';

let server;

describe('/api/users', () => {

  beforeEach(() => {
    server = require('../../index');
  });

  afterEach(async () => {
    server.close();
    await UserModel.remove({});
  });

  describe('Testing the isUserUnique function', ()=>{
    // Add test case for the isUserUnique() function
    it('isUserUnique() => it should return true if the user is unique', async () => {
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
      const result = UserController.isUserUnique(payload);
      expect(result).toBeTruthy();
    });

    // Add test case for the isUserUnique() function
    it('isUserUnique() => it should return false if the user is not unique', async () => {
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
      const result = UserController.isUserUnique(payload);
      expect(result).toBeFalsy();
    });
  })
});