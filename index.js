import mongoose from 'mongoose';
import 'dotenv/config';
import express from 'express';

const username = process.env.USERNAME;
const password = process.env.PASSWORD;
let database = process.env.DATABASE;
if (process.env.ENVIRONMENT === 'TESTING') database = process.env.TEST_DATABASE;
const PORT = process.env.PORT || 3000;
const app = express();

const connectionString = `mongodb://${username}:${password}@ds145704.mlab.com:45704/${database}`;

mongoose.connect(connectionString, {useNewUrlParser: true})
  .then(() => {
    return true
  })
  .catch((error) => {
    console.log(error)
  });

app.listen(PORT, () => {
  console.log(`App is running on port: ${PORT}`);
});

export default app;

