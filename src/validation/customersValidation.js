import Joi from "joi";

const customersSchema = Joi.object().keys({
    customerNumber: Joi.number().positive().required().invalid(null).forbidden().error(new Error('customerNumber should not be changed.')),
    customerName: Joi.string().required().min(5).max(50).invalid(null),
    contactLastName: Joi.string().required().min(3).max(50).invalid(null),
    contactFirstName: Joi.string().required().min(3).max(50).invalid(null),
    phone: Joi.string().required().min(8).max(20).invalid(null),
    addressLine1: Joi.string().required().min(10).max(50).invalid(null),
    addressLine2: Joi.string().optional().min(10).max(50).allow(null),
    city: Joi.string().required().min(2).max(50).invalid(null),
    state: Joi.string().optional().min(2).max(50).allow(null),
    postalCode: Joi.string().optional().min(5).max(15).allow(null),
    country: Joi.string().required().min(2).max(50).invalid(null),
    salesRepEmployeeNumber: Joi.number().positive().required().allow(null),
    creditLimit: Joi.number().precision(2).less(1e8),
});

module.exports = customersSchema;