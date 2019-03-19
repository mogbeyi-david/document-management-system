import Joi from 'joi';

function validateUser(user) {
  const schema = {
    firstname: Joi.string().max(255).required('Please enter a Firstname'),
    lastname: Joi.string().max(255).required('Please enter a Lastname'),
    email: Joi.string().max(255).required('Please enter an email address').email(),
    password: Joi.string().min(6).max(255).required()
  };

  return Joi.validate(user, schema);
}

export default validateUser;