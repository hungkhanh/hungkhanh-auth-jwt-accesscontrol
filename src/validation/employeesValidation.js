import Joi from "joi";

const employeesSchema = Joi.object().keys({
    employeeNumber: Joi.number().required().positive().invalid(null).forbidden().error(new Error('employeeNumber should not be changed.')),
    lastName: Joi.string().required().min(3).max(50).invalid(null).forbidden().error(new Error('lastName should not be changed.')),
    firstName: Joi.string().required().min(3).max(50).invalid(null).forbidden().error(new Error('firstName should not be changed.')),
    extension: Joi.string().required().max(50).invalid(null),
    email: Joi.string().required().email({ tlds: { allow: false } }).min(10).max(100).invalid(null),
    officeCode: Joi.string().required().max(10).invalid(null),
    reportsTo: Joi.number().positive().optional().allow(null),
    jobTitle: Joi.string().required().valid('President', 'Manager', 'Leader', 'Staff'),
});

module.exports = employeesSchema;