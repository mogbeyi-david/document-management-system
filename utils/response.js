import * as HttpStatus from 'http-status-codes';

class JsonResponse {
  // Define the format for a successful response
  success(res, statusCode = HttpStatus.OK, message = 'Operation successful', data = {}) {
    return res.status(statusCode).send({message, data});
  }

  // Define the format for a failed response
  error(res, statusCode = HttpStatus.BAD_REQUEST, message = 'Operation failed', data = null) {
    return res.status(statusCode).send({message, data});
  }
}


const jsonResponse = new JsonResponse();

export {
  jsonResponse
};