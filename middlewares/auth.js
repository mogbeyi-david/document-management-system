import * as HttpStatus from 'http-status-codes';
import jwt from 'jsonwebtoken';
import 'dotenv/config';

function auth(req, res, next) {
  const token = req.header('x-auth-token');
  if (!token) {
    return res.status(HttpStatus.UNAUTHORIZED).send('No token provided');
  }
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET_KEY);next();
  } catch (exception) {
    res.status(HttpStatus.BAD_REQUEST).send('Invalid token');
  }
}

module.exports = auth;