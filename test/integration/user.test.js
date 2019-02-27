import app from '../../index';
import supertest from 'supertest';
import UserModel from '../../models/user';

let server;

describe('/api/users', () => {
  beforeEach(() => {
    server = app;
  });
  afterEach(async () => {
    server.close();
    await UserModel.remove({});
  });
});