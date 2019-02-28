import * as HttpStatus from 'http-status-codes';
import {User as UserModel} from '../../../models';
import {validateUser} from '../../../validation';


exports.isUserUnique = async function (user) {
  const email = user.email;
  const existingUser = await UserModel.find({email: email});
  return existingUser.length <= 0;
};

exports.store = function (req, res) {
  const {error, value} = validateUser(req.body);
  if (error) {
    return res.status(HttpStatus.BAD_REQUEST)
      .send({message: error.details[0].message, data: value});
  }
};
