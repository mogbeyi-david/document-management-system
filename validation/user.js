import Joi from 'joi';

function validateUser(user) {
  const schema = {
    firstname: Joi.string().maxlength(255).required('Please enter a Firstname'),
    lastname: Joi.string().maxlength(255).required('Please enter a Lastname'),
    email: Joi.string().maxlength(255).required('Please enter an email address').email(),
    password: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/).required()
  };

  return Joi.validate(user, schema);
}

export default validateUser;