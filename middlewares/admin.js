import * as HttpStatus from 'http-status-codes';

function admin(req, res, next) {
  if (req.user.role !== 'ADMIN') {
    return res.status(HttpStatus.FORBIDDEN).send({message: 'Access Denied', data: null});
  }
  next();
}

export {
  admin
}