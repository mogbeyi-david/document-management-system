import _ from 'lodash';
import * as HttpStatus from 'http-status-codes';
import {User as UserModel} from '../../../models';
import {validateLoginPayload} from '../../../validation';
import bcrypt from 'bcrypt';

exports.login = async function (req, res) {

  // Validate the payload using Joi
  const {error, value} = validateLoginPayload(req.body);
  if (error) {
    return res.status(HttpStatus.BAD_REQUEST)
      .send({message: error.details[0].message, data: value});
  }

  //Check if the user already exists
  const user = await UserModel.findOne({email: req.body.email});
  if (!user) {
    return res.status(HttpStatus.NOT_FOUND)
      .send({message: 'Invalid Email or Password', data: req.body});
  }

  try {
    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) {
      return res.status(HttpStatus.NOT_FOUND).send({message: 'Invalid Email or Password', data: req.body});
    }
  } catch (exception) {
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(exception.message);
  }
};
