import mongoose from 'mongoose';
import 'dotenv/config';
import express from 'express';

const username = process.env.USERNAME;
const password = process.env.PASSWORD;
let database = process.env.DATABASE;
if (process.env.ENVIRONMENT === 'TESTING') database = process.env.TEST_DATABASE;
const PORT = process.env.PORT || 3000;
const app = express();

const connectionString = `mongodb://${username}:${password}@ds255005.mlab.com:55005/${database}`;


mongoose.connect(connectionString, {useNewUrlParser: true})
  .then(() => {
    console.log('Connected to remote DB successfully')
  })
  .catch((error) => {
    console.log(error)
  });

app.listen(PORT, () => {
  console.log(`App is running on port: ${PORT}`);
});

export default app;

