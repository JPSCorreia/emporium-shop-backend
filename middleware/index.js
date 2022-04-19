const Joi = require('joi');

const schema = Joi.object({
    username: Joi.string()
        .alphanum()
        .min(3)
        .max(30)
        .required(),

    password: Joi.string()
      .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),
  
    first_name: Joi.string()
        .alphanum()
        .min(3)
        .max(30)
        .required(),
    
    last_name: Joi.string()
        .alphanum()
        .min(3)
        .max(30)
        .required()
})

const middlewareObj = {
  
  validateRegistration: function (req, res, next) {
    const value = req.body;
    const result = schema.validate(value)
    if (!result.error) {
      return next();
    }
    throw result.error
  }
}



module.exports = middlewareObj;