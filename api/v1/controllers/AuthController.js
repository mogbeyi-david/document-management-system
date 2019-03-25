import _ from 'lodash';
import * as HttpStatus from 'http-status-codes';
import {User as UserModel} from '../../../models';
import {validateLoginPayload} from '../../../validation';
import bcrypt from 'bcrypt';
import {jsonResponse} from '../../../utils/response';

exports.login = async function (req, res) {

  // Validate the payload from the client using Joi
  const {error, value} = validateLoginPayload(req.body);
  if (error) {
    return jsonResponse.error(res, HttpStatus.BAD_REQUEST, error.details[0].message, value);
  }

  //Check if the user truly exists
  const user = await UserModel.findOne({email: req.body.email});
  // If the user does not exist, return a 404(Not Found) error to the client
  if (!user) {
    return jsonResponse.error(res, HttpStatus.NOT_FOUND, 'Invalid Email or Password', req.body);
  }


  try {
    // If the user is found, use the bcrypt library to compare the user's password in the database to the one sent from the client
    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) {
      // If the comparison does not show that they are actually the same then send an error to the client
      return jsonResponse.error(res, HttpStatus.NOT_FOUND, 'Invalid Email or Password', req.body);
    }

    //However, if the password matches, then login in the user.
    const token = user.generateJsonWebToken(); // Generate the Json web token
    const data = _.pick(user, ['firstname', 'lastname', 'email', 'role', '_id']); // Pick out data to be sent to the client
    res.header('x-auth-token', token); // Set the json web token in the header of the response
    return jsonResponse.success(res, HttpStatus.OK, 'Login successful', data); // Send the data back to the client
  } catch (exception) {
    // In the case of any error, catch it and send it to the client
    return jsonResponse.error(res, HttpStatus.INTERNAL_SERVER_ERROR, exception.message);
  }
};
