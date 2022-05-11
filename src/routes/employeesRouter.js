import { celebrate, Segments } from "celebrate";
import express from "express";
import Joi from "joi";
import { errors } from 'celebrate';
import employeesSchema from "../validation/employeesValidation"
import employeesController from "../controllers/employeesController";

const router = express.Router();

router.route('/')
    .get(employeesController.getAllEmployees)
    .post(celebrate({
        body: employeesSchema
    }),
        employeesController.createEmployee
    )
    .delete(employeesController.deleteAllEmployees)
    .patch(employeesController.linkEmployee) // assign users[employeeNumber] = employeeNumber

router.route('/:employeeNumber')
    .get(employeesController.getOneEmployee)
    .put(celebrate({
        body: employeesSchema
    }),
        employeesController.updateOrCreateEmployee
    )
    .patch(celebrate({
        body: employeesSchema
    }),
        employeesController.updateEmployee
    )
    .delete(employeesController.deleteOneEmployee)

router.use(errors());

module.exports = router;

