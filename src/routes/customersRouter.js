import { celebrate, Segments } from "celebrate";
import express from "express";
import Joi from "joi";
import customersSchema from '../validation/customersValidation'
import customersController from '../controllers/customersController';
import { errors } from 'celebrate';

const router = express.Router();

router.route('/')
    .get(customersController.getAllCustomers)
    .post(celebrate({
        body: customersSchema
    }),
        customersController.createCustomer
    )
    .delete(customersController.deleteAllCustomers)

router.route('/:customerNumber')
    .get(customersController.getOneCustomer)
    .put(celebrate({
        body: customersSchema
    }),
        customersController.updateOrCreateCustomer
    )
    .patch(celebrate({
        body: customersSchema
    }),
        customersController.updateCustomer
    )
    .delete(customersController.deleteOneCustomer)

router.use(errors());

module.exports = router;