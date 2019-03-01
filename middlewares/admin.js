import * as HttpStatus from 'http-status-codes';

function admin(req, res, next) {
  if (!req.user.isAdmin) {
    return res.status(HttpStatus.FORBIDDEN).send({message: 'Access Denied'});
  }
  next();
}

module.exports = admin;