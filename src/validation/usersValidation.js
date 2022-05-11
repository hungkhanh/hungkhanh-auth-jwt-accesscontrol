import Joi from "joi";

const usersSchema = Joi.object({
    username: Joi.string().required().min(3).max(20).invalid(null),
    password: Joi.string().required().pattern(new RegExp('^(?=.*[0-9])(?=.*[*.!@$%^&(){}[]:;<>,.?/~_+-=|]).{6,100}$')).invalid(null),
    employeeNumber: Joi.number().required().positive().invalid(null),
});

module.exports = usersSchema;