import _ from 'lodash';
import * as HttpStatus from 'http-status-codes';
import {User as UserModel} from '../../../models';
import {validateUser} from '../../../validation';
import hasher from '../../../utils/hash';


//Method to determine if an about-to-be-created user is unique, using the email in the payload
async function isUserUnique(user) {
  const email = user.email;
  // Check if there is an existing user with the email in the DB
  const existingUser = await UserModel.find({email: email});
  return existingUser.length <= 0;
}

//Action to store the new user in the database
exports.store = async function (req, res) {

  // API level validation: Check the payload for any improper data using Joi
  const {error, value} = validateUser(req.body);
  if (error) {
    return res.status(HttpStatus.BAD_REQUEST)
      .send({message: error.details[0].message, data: value});
  }

  // Check if the user already exists in the database
  if (!await isUserUnique(req.body)) {
    return res.status(HttpStatus.BAD_REQUEST)
      .send({
        message: 'User already exists',
        data: req.body
      });
  }


  try {
    const newUser = new UserModel({
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      email: req.body.email,
      role: 'REGULAR',
      password: await hasher.hashPassword(req.body.password)
    });
    const result = await newUser.save();
    // Use lodash to pick out ONLY the data to be sent back to the client as a response
    const response = _.pick(result, ['_id', 'firstname', 'lastname', 'email', 'role']);
    return res.status(HttpStatus.CREATED).send({
      message: 'User created successfully',
      data: response
    });
  } catch (exception) {
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(exception.message);
  }
};

// Action to get all users
exports.get = async function (req, res) {
  try {
    const users = await UserModel.find({});
    return res.status(HttpStatus.OK).send({message: 'Operation successful', data: users});
  } catch (exception) {
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({message: 'Operation failed', data: null});
  }
};
export {
  isUserUnique
};