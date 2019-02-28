import _ from 'lodash';
import * as HttpStatus from 'http-status-codes';
import {User as UserModel} from '../../../models';
import {validateLoginPayload} from '../../../validation';
import hasher from '../../../utils/hash';

exports.login = async function (req, res) {
  const {error, value} = validateLoginPayload(req.body);
  if (error) {
    return res.status(HttpStatus.BAD_REQUEST)
      .send({message: error.details[0].message, data: value});
  }
};