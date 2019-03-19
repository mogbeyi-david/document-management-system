import _ from 'lodash';
import * as HttpStatus from 'http-status-codes';
import {User as UserModel} from '../../../models';
import {validateUser} from '../../../validation';
import hasher from '../../../utils/hash';


//Method to determine if an about-to-be-created user is unique, using the email in the payload
async function isUserUnique(user) {
  const email = user.email;
  const existingUser = await UserModel.find({email: email});
  return existingUser.length <= 0;
}

//Method to store the new user in the database
exports.store = async function (req, res) {

  // Check the payload for any improper data
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
    const response = _.pick(result, ['_id', 'firstname', 'lastname', 'email', 'role']);
    return res.status(HttpStatus.CREATED).send({
      message: 'User created successfully',
      data: response
    });
  } catch (exception) {
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(exception.message);
  }
};


export {
  isUserUnique
};