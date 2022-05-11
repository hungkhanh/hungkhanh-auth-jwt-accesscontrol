
import jwt from 'jsonwebtoken';
// import { where } from 'sequelize/types';

import db from '../models';
import accesscontrol from '../policy/role';

const User = db.users
const Employee = db.employees
const Customer = db.customers

// 1. get all employees
const getAllEmployees = async (req, res) => {
    const username = res.locals.username
    try {
        //  get jobTitle
        const jobTitle = getJobTitle(username);
        
        // Check role permissions
        const permission = accesscontrol.can(jobTitle).readAny('employees');
        if(permission.granted) {
            const employees = await Employee.findAll({});
            res.status(200).send(employees);    
        } else {
            res.status(403).end();
        }
    } catch (error) {
        console.log(error);
    }
}

// 2. create a employee
const createEmployee = async (req, res) => {
    const data = req.body;
    const username = res.locals.username
    try {
        //  get jobTitle
        // const jobTitle = await getJobTitle(username);
        const user = await User.findByPk(username);
        const employee = await Employee.findByPk(user.employeeNumber);
        const jobTitle = employee.jobTitle;

        // console.log(`jobTitle: ${jobTitle}`);
        // Check role permissions
        const permission = accesscontrol.can(jobTitle).createAny('employees');
        if(permission.granted) {
            const employee = await Employee.create(data);
            // const jwt_token = req.cookies.jwt_token;
            // const username = jwt.verify(jwt_token, process.env.ACCESS_TOKEN_SECRET); 
            
            // create new employee
            // await User.update({ employeeNumber: employee.employeeNumber }, { where: { username: username }});
            res.status(201).json({
                success: true,
                data: employee
            })
        } else {
            res.status(403).end();
        }
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
    const username = res.locals.username
    try {
        //  get jobTitle
        const jobTitle = getJobTitle(username);

        // Check role permissions
        const permission = accesscontrol.can(jobTitle).deleteAny('employees');
        if(permission.granted) {
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
        } else {
            res.status(403).end();
        }
    } catch (error) {
        console.log(error);
    }
}

// 4. get one employee by Id
const getOneEmployee = async (req, res) => {
    const employeeNumber = req.params.employeeNumber;
    const username = res.locals.username
    try {
        //  get jobTitle
        const jobTitle = getJobTitle(username);

        // Check role permissions
        const permission = accesscontrol.can(jobTitle).readAny('employees');
        if(permission.granted) {
            const employee = await Employee.findByPk(employeeNumber);
            res.status(200).send(employee);  
        } else {
            res.status(403).end();
        }
    } catch (error) {
        console.log(error);
    }
}

// 5. update info employee PUT by Id
const updateOrCreateEmployee = async (req, res) => {
    const employeeNumber = req.params.employeeNumber;
    const data = req.body;
    const username = res.locals.username
    try {
        //  get jobTitle
        const jobTitle = getJobTitle(username);

        // Check role permissions
        const permission = accesscontrol.can(jobTitle).updateAny('employees');
        if(permission.granted) {
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
        } else {
            res.status(403).end();
        }
    } catch (error) {
        console.log(error);
    }
}

// 6. update info employee PATCH by Id
const updateEmployee = async (req, res) => {
    const employeeNumber = req.params.employeeNumber;
    const data = req.body;
    const username = res.locals.username




    try {

        //  get jobTitle
        const jobTitle = getJobTitle(username);

        // Check role permissions
        const permission = accesscontrol.can(jobTitle).updateAny('employees');
        if(permission.granted) {
            const employee = await Employee.update(data, { where: { employeeNumber: employeeNumber }});
            res.status(200).json({
                success: true,
                message: "Update a employee",
                data: employee
            })  
        } else {
            res.status(403).end();
        }        
    } catch (error) {
        console.log(error);
    }
}

// 7. delete one employee by Id
const deleteOneEmployee = async (req, res) => {
    const employeeNumber = req.params.employeeNumber;
    const VALUE_NULL_CUSTOMER = { salesRepEmployeeNumber: null };
    const VALUE_NULL_EMPLOYEE = { reportsTo: null };
    const username = res.locals.username
    try {

        //  get jobTitle
        const jobTitle = getJobTitle(username);

        // Check role permissions
        const permission = accesscontrol.can(jobTitle).deleteAny('employees');
        if(permission.granted) {
            await Employee.update(VALUE_NULL_EMPLOYEE, { where: { reportsTo: employeeNumber }});
            await Customer.update(VALUE_NULL_CUSTOMER, { where: { salesRepEmployeeNumber: employeeNumber }});
            await Employee.destroy({ where: { employeeNumber: employeeNumber}});
            res.status(200).json({
                success: true,
                message: "Delete a employee"
            });
        } else {
            res.status(403).end();
        }
    } catch (error) {
        console.log(error);
    }
}

// 8. link employeeNumber from employees to users
const linkEmployee = async (req, res) => {
    const usernameEmployee = req.body.username;
    const username = res.locals.username
    const data = { employeeNumber: req.body.employeeNumber };
    try {
        const userBoss = await User.findByPk(username);
        const employeeBoss = await Employee.findByPk(userBoss.employeeNumber);
        const jobTitle = employeeBoss.jobTitle;

        const permission = accesscontrol.can(jobTitle).createAny('employees');
        if(permission.granted) {
            const updateEmployeeNummber = await User.update(data, { where: { username: usernameEmployee }});
            res.status(200).json({
                success: true,
                message: 'Update employeeNumber'
            });
        } else {
            res.status(403).end();
        }
        
        
    } catch (error) {
        console.log(error);
    }
}

// 8. get all customers of an employee
// const getCusomtersOfEmployee = async (req, res) => {
//     const employeeNumber = req.params.employeeNumber;
//     const username = req.locals.username;

//     try {
//         //  get jobTitle
//         const jobTitle = getJobTitle(username);

//         // Check role permissions
//         const permission = accesscontrol.can(jobTitle).readOwn('employees');
//         if(permission.granted) {
//             const employees = await Employee.findAll({});
//             res.status(200).send(employees);    
//         } else {
//             res.status(403).end();
//         }        
//         const data = await Employee.findAll({
//             include: [{
//                 model: Customer,
//                 as: 'customer'
//             }],
//             where: { employeeNumber: employeeNumber}
//         });
//         res.status(200).send(data);
//     } catch (error) {
//         console.log(error);
//     }
// }

// 9. BONUS get all staff of an employee by reportsTo
// const getStaffsOfEmployee = async (req, res) => {
//     const employeeNumber = req.params.employeeNumber;
//     try {
//         const data = await Employee.findAll({
//             include: [{
//                 model: Employee,
//                 as: 'staff'
//             }],
//             where: { employeeNumber: employeeNumber }
//         });
//         res.status(200).send(data);
//     } catch (error) {
//         console.log(error);
//     }
// }



// get jobTitle
async function getJobTitle(username) {
    const user = await User.findByPk(username);
    const employee = await Employee.findByPk(user.employeeNumber);
    return employee.jobTitle;
}

module.exports = {
    getAllEmployees,
    createEmployee,
    deleteAllEmployees,

    getOneEmployee,
    updateOrCreateEmployee,
    updateEmployee,
    deleteOneEmployee,

    linkEmployee

    // getCusomtersOfEmployee,
    // getStaffsOfEmployee
}