import Joi from "joi";

export async function userCreateValidator(req, res, next) {
  const schema = Joi.object().keys({
    username: Joi.string().required(),
    age: Joi.number().required(),
    hobbies: Joi.array().items(Joi.string()).required(),
  });

  const { error } = await schema.validate(req.body);
  if (error) {
    return res.status(400).json({
      success: false,
      message: error.details[0].message,
    });
  }
  next();
}