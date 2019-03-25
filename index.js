// Pull in dependencies
import mongoose from 'mongoose';
import 'dotenv/config';
import express from 'express';
import bodyParser from 'body-parser';
import morgan from 'morgan';

import {userRouter} from './api/v1';

// Declare environment variables
const username = process.env.USERNAME;
const password = process.env.PASSWORD;
let database = process.env.DATABASE;
if (process.env.NODE_ENV === 'testing') database = process.env.TEST_DATABASE;
const PORT = process.env.PORT || 3000;
const app = express();


//Attempt connection to remote DB
const connectionString = `mongodb://${username}:${password}@ds255005.mlab.com:55005/${database}`;
mongoose.connect(connectionString, {useNewUrlParser: true})
  .then(() => {
    console.log('Connected to remote DB successfully');
  })
  .catch((error) => {
    // Do something amazing with this error...
  });

// Use middlewares

// => parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}));

// => parse application/json
app.use(bodyParser.json());

// => Use morgan for logging
// app.use(morgan('combined'));

app.use(express.json());

app.use('/api/v1/users', userRouter);

// End of Middlewares

// Listen on PORT
const server = app.listen(PORT, () => {
  console.log(`App is running on port: ${PORT}`);
});

// Export app
export default server;

