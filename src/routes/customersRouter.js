import express from "express";

import customersController from '../controllers/customersController';


const router = express.Router();

router.route('/')
    .get(customersController.getAllCustomers)
    .post(customersController.createCustomer)
    .delete(customersController.deleteAllCustomers)

router.route('/:customerNumber')
    .get(customersController.getOneCustomer)
    .put(customersController.updateOrCreateCustomer)
    .patch(customersController.updateCustomer)
    .delete(customersController.deleteOneCustomer)

module.exports = router;