import * as HttpStatus from 'http-status-codes';
import jwt from 'jsonwebtoken';
import 'dotenv/config';

function auth(req, res, next) {
  const token = req.header('x-auth-token');
  if (!token) {
    return res.status(HttpStatus.UNAUTHORIZED).send({message: 'No token provided', data: null});
  }
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET_KEY);
    next();
  } catch (exception) {
    return res.status(HttpStatus.BAD_REQUEST).send({message: 'Invalid token', data: null});
  }
}

export {
  auth
};