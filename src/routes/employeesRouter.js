import express from "express";

import employeesController from "../controllers/employeesController";

const router = express.Router();

router.route('/')
    .get(employeesController.getAllEmployees)
    .post(employeesController.createEmployee)
    .delete(employeesController.deleteAllEmployees)

router.route('/:employeeNumber')
    .get(employeesController.getOneEmployee)
    .put(employeesController.updateOrCreateEmployee)
    .patch(employeesController.updateEmployee)
    .delete(employeesController.deleteOneEmployee)

    router.get('/:employeeNumber/getAllCustomers', employeesController.getCusomtersOfEmployee)
    router.get('/:employeeNumber/getAllStaffs', employeesController.getStaffsOfEmployee)



module.exports = router;

