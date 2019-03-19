import Joi from 'joi';

function validateLoginPayload(payload) {
  const schema = {
    email: Joi.string().max(255).required('Please enter an email address').email(),
    password: Joi.string().min(6).max(255).required()
  };

  return Joi.validate(payload, schema);
}

export default validateLoginPayload;