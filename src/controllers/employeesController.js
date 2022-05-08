import db from '../models';

const User = db.users
const Employee = db.employees
const Customer = db.customers

// 1. get all employees
const getAllEmployees = async (req, res) => {
    try {
        let employees = await Employee.findAll({});
        res.status(200).send(employees);    
    } catch (error) {
        console.log(error);
    }
}

// 2. create a employee
const createEmployee = async (req, res) => {
    const data = req.body;
    try {
        const employee = await Employee.create(data);
        res.status(201).json({
            success: true,
            data: employee
        })
    } catch (error) {
        console.log(error);
    }
}

// 3. delete all employees
const deleteAllEmployees = async (req, res) => {
    const CONSTRAINT_CUSTOMERS_EMPLOYEES = 'customers_ibfk_1';
    const CUSTOMERS_TABLE = 'customers';
    const EMPLOYEES_TABLE = 'employees';
    const EMPLOYEES_PK = 'employeeNumber';
    const CUSTOMERS_REF = 'salesRepEmployeeNumber';
    const VALUE_NULL_CUSTOMER = { salesRepEmployeeNumber: null };

    try {
        await Customer.update(VALUE_NULL_CUSTOMER, { where: {}});
        await db.sequelize.queryInterface.removeConstraint(CUSTOMERS_TABLE, CONSTRAINT_CUSTOMERS_EMPLOYEES);
        await Employee.truncate();
        await db.sequelize.queryInterface.addConstraint(CUSTOMERS_TABLE, {
            fields: [CUSTOMERS_REF],
            type: 'foreign key',
            name: CONSTRAINT_CUSTOMERS_EMPLOYEES,
            references: {
                table: EMPLOYEES_TABLE,
                field: EMPLOYEES_PK
            },
            onDelete: 'cascade',
            onUpdate: 'cascade'
        })
        res.status(200).json({
            success: true,
            message: "Delete all employees"
        });
    } catch (error) {
        console.log(error);
    }
}

// 4. get one employee by Id
const getOneEmployee = async (req, res) => {
    const employeeNumber = req.params.employeeNumber;
    try {
        const employee = await Employee.findByPk(employeeNumber);
        res.status(200).send(employee);
    } catch (error) {
        console.log(error);
    }
}

// 5. update info employee PUT by Id
const updateOrCreateEmployee = async (req, res) => {
    const employeeNumber = req.params.employeeNumber;
    const data = req.body;
    try {
        let employee = Employee.findByPk(employeeNumber);
        if(!employee) {
            employee = await Employee.create(data);
        } else {
            employee = await Employee.update(data, { where: { employeeNumber: employeeNumber }});
        }
        res.status(200).json({
            success: true,
            message: "Update or Create a employee",
            data: employee
        });
    } catch (error) {
        console.log(error);
    }
}

// 6. update info employee PATCH by Id
const updateEmployee = async (req, res) => {
    const employeeNumber = req.params.employeeNumber;
    const data = req.body;
    try {
        const employee = await Employee.update(data, { where: { employeeNumber: employeeNumber }});
        res.status(200).json({
            success: true,
            message: "Update a employee",
            data: employee
        })
    } catch (error) {
        console.log(error);
    }
}

// 7. delete one employee by Id
const deleteOneEmployee = async (req, res) => {
    const employeeNumber = req.params.employeeNumber;
    const VALUE_NULL_CUSTOMER = { salesRepEmployeeNumber: null };
    const VALUE_NULL_EMPLOYEE = { reportsTo: null };
    try {
        await Employee.update(VALUE_NULL_EMPLOYEE, { where: { reportsTo: employeeNumber }});
        await Customer.update(VALUE_NULL_CUSTOMER, { where: { salesRepEmployeeNumber: employeeNumber }});
        await Employee.destroy({ where: { employeeNumber: employeeNumber}});
        res.status(200).json({
            success: true,
            message: "Delete a employee"
        });
    } catch (error) {
        console.log(error);
    }
}

// 8. get all customers of an employee
const getCusomtersOfEmployee = async (req, res) => {
    const employeeNumber = req.params.employeeNumber;
    try {
        const data = await Employee.findAll({
            include: [{
                model: Customer,
                as: 'customer'
            }],
            where: { employeeNumber: employeeNumber}
        });
        res.status(200).send(data);
    } catch (error) {
        console.log(error);
    }
}

// 9. get all staff of an employee
const getStaffsOfEmployee = async (req, res) => {
    const employeeNumber = req.params.employeeNumber;
    try {
        const data = await Employee.findAll({
            include: [{
                model: Employee,
                as: 'staff'
            }],
            where: { employeeNumber: employeeNumber }
        });
        res.status(200).send(data);
    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    getAllEmployees,
    createEmployee,
    deleteAllEmployees,

    getOneEmployee,
    updateOrCreateEmployee,
    updateEmployee,
    deleteOneEmployee,

    getCusomtersOfEmployee,
    getStaffsOfEmployee
}