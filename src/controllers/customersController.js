import db from '../models';
import accesscontrol from '../policy/role';
import logger from '../winston/logger';
const User = db.users
const Employee = db.employees
const Customer = db.customers

// 1. get all customers
const getAllCustomers = async (req, res, next) => {
    const username = res.locals.username;
    logger.log('info', 'GET all customers');
    try {
        const user = await User.findByPk(username);
        const employee = await Employee.findByPk(user.employeeNumber);
        const jobTitle = employee.jobTitle;

        let permission;
        switch(jobTitle) {
            case 'President': case 'Manager':
                permission = accesscontrol.can(jobTitle).readAny('customers');
                break;
            case 'Leader':
                permission = accesscontrol.can(jobTitle).read('customers');
                break;
            case 'Staff':
                permission = accesscontrol.can(jobTitle).readOwn('customers');
                break; 
            default:
                res.status(403).end();
                break;
        }

        let customers;
        if(permission.granted) {
            switch(jobTitle) {
                case 'President': case 'Manager':
                    customers = await Customer.findAll({});
                    break;
                case 'Leader':
                    const employeesSameOffice = await Employee.findAll({ where: { officeCode: employee.officeCode }});
                    const employeeNumberArr = employeesSameOffice.map(e => e.employeeNumber);
                    customers = await Customer.findAll({ where: { salesRepEmployeeNumber: employeeNumberArr }});
                    break;
                case 'Staff':
                    customers = await Customer.findAll({ where: { salesRepEmployeeNumber: user.employeeNumber }});
                    break; 
                default:                    
                    break;
            }
            res.status(200).send(customers);
        } else {
            res.status(403).end();
        }
        res.status(200).send(customers);    
    } catch (error) {
        next(error);
    }
}

// 2. create a customer
const createCustomer = async (req, res, next) => {
    const data = req.body;
    const username = res.locals.username;
    logger.log('info', 'POST create customer');
    try {

        const user = await User.findByPk(username);
        const employee = await Employee.findByPk(user.employeeNumber);
        const jobTitle = employee.jobTitle;

        let permission;
        switch(jobTitle) {
            case 'President': case 'Manager':
                permission = accesscontrol.can(jobTitle).createAny('customers');
                break;
            case 'Leader':
                permission = accesscontrol.can(jobTitle).create('customers');
                break;
            case 'Staff':
                permission = accesscontrol.can(jobTitle).createOwn('customers');
                break; 
            default:
                res.status(401).end();
                break;
        }

        let customer;
        if(permission.granted) {
            if(jobTitle === 'President' || jobTitle === 'Manager') {
                customer = await Customer.create(data);
            } else if(jobTitle === 'Leader') {
                const employeesSameOffice = await Employee.findAll({ where: { officeCode: employee.officeCode }});
                const employeeNumberArr = employeesSameOffice.map(e => e.employeeNumber);
                if(employeeNumberArr.findIndex(data.salesRepEmployeeNumber) != -1) {
                    customer = await Customer.create(data);
                } else {
                    res.status(401).end();        
                }
            } else {
                if(data.salesRepEmployeeNumber === user.employeeNumber) {
                    customer = await Customer.create(data);
                } else {
                    res.status(401).end();
                }
            }
        } else {
            res.status(403).end();
        }
        res.status(201).json({
            success: true,
            data: customer
        })
    } catch (error) {
        next(error);
    }
}

// 3. delete all customers
const deleteAllCustomers = async (req, res, next) => {
    const username = res.locals.username
    logger.log('info', 'DELETE all customers');
    try {
        const user = User.findByPk(username);
        const employee = Employee.findByPk(user);
        const jobTitle = employee.jobTitle;
        
        const permission = accesscontrol.can(jobTitle).deleteAny('customers');
        if(permission.granted) {
            await Customer.truncate();
            res.status(200).json({
                success: true,
                message: "Delete all customers"
            });    
        } else {
            res.status(403).end();
        }
    } catch (error) {
        next(error);
    }
}

// 4. get one customer by Id
const getOneCustomer = async (req, res, next) => {
    const customerNumber = req.params.customerNumber;
    const username = res.locals.username;
    logger.log('info', 'GET customer');
    try {
        const user = await User.findByPk(username);
        const employee = await Employee.findByPk(user.employeeNumber);
        const jobTitle = employee.jobTitle;

        let permission;
        switch(jobTitle) {
            case 'President': case 'Manager':
                permission = accesscontrol.can(jobTitle).readAny('customers');
                break;
            case 'Leader':
                permission = accesscontrol.can(jobTitle).read('customers');
                break;
            case 'Staff':
                permission = accesscontrol.can(jobTitle).readOwn('customers');
                break; 
            default:
                res.status(403).end();
                break;
        }

        const customer = await Customer.findByPk(customerNumber);
        let isOK = false;
        if(jobTitle === 'President' || jobTitle === 'Manager') {
            isOK = true;
        } else if(jobTitle === 'Leader') {
            const employeesSameOffice = await Employee.findAll({ where: { officeCode: employee.officeCode }});
            const employeeNumberArr = employeesSameOffice.map(e => e.employeeNumber);
            if(employeeNumberArr.findIndex(customer.salesRepEmployeeNumber) != -1) {
                isOK = true;
            } else {
                res.status(401).end();
            }
        } else {
            if(customer.salesRepEmployeeNumber === user.employeeNumber) {
                isOK = true;
            } else {
                res.status(401).end();
            }
        }

        if(isOK === true) {
            res.status(200).send(customer);
        } else {
            res.status(401).end();
        }
        
    } catch (error) {
        next(error);
    }
}

// 5. update info customer PUT by Id
const updateOrCreateCustomer = async (req, res, next) => {
    const customerNumber = req.params.customerNumber;
    const data = req.body;
    const username = res.locals.username;
    logger.log('info', 'PUT update customer');
    try {
        const user = User.findByPk(username);
        const employee = Employee.findByPk(user.employeeNumber);
        const jobTitle = employee.jobTitle;

        const permission = accesscontrol.can(jobTitle).createAny('customers');
        if(permission.granted) {
            let customer = Customer.findByPk(customerNumber);
            if(!customer) {
                customer = await Customer.create(data);
            } else {
                customer = await Customer.update(data, {where: { customerNumber: customerNumber }});
            }
            res.status(200).json({
                success: true,
                message: "Update or Create a customer",
                data: customer
            });
        } else {
            res.status(403).end();
        }

    } catch (error) {
        next(error);
    }
}

// 6. update info customer PATCH by Id
const updateCustomer = async (req, res, next) => {
    const customerNumber = req.params.customerNumber;
    const data = req.body;
    const username = res.locals.username;
    logger.log('info', 'PATCH customer');
    try {
        const user = User.findByPk(username);
        const employee = Employee.findByPk(user.employeeNumber);
        const customer = Employee.findByPk(customerNumber);
        const jobTitle = employee.jobTitle;
        let isOK = false;
        if(jobTitle === 'President' || jobTitle === 'Manager') {
            isOK = true;
        } else if(jobTitle === 'Leader') {
            const employeesSameOffice = await Employee.findAll({ where: { officeCode: employee.officeCode }});
            const employeeNumberArr = employeesSameOffice.map(e => e.employeeNumber);
            if(employeeNumberArr.findIndex(customer.salesRepEmployeeNumber) != -1) {
                isOK = true;
            } else {
                res.status(401).end();
            }
        } else {
            res.status(401).end();
        }

        if(isOK === true) {
            const customer = await Customer.update(data, { where: { customerNumber: customerNumber}});
            res.status(200).json({
                success: true,
                message: "Update a customer",
                data: customer
            });
        } else {
            res.status(401).end()
        }
    } catch (error) {
        next(error);
    }
}

// 7. delete one customer by Id
const deleteOneCustomer = async (req, res, next) => {
    const customerNumber = req.params.customerNumber;
    const username = res.locals.username;
    logger.log('info', 'DELETE customer');
    try {
        const user = User.findByPk(username);
        const employee = Employee.findByPk(user.employeeNumber);
        const customer = Employee.findByPk(customerNumber);
        const jobTitle = employee.jobTitle;

        let isOK = false;
        if(jobTitle === 'President' || jobTitle === 'Manager') {
            isOK = true;
        } else if(jobTitle === 'Leader') {
            const employeesSameOffice = await Employee.findAll({ where: { officeCode: employee.officeCode }});
            const employeeNumberArr = employeesSameOffice.map(e => e.employeeNumber);
            if(employeeNumberArr.findIndex(customer.salesRepEmployeeNumber) != -1) {
                isOK = true;
            } else {
                res.status(401).end();
            }
        } else {
            res.status(401).end();
        }

        if(isOK === true) {
            await Customer.destroy({ where: { customerNumber: customerNumber}});
            res.status(200).json({
                success: true,
                message: "Delete a customer"
            });
        } else {
            res.status(401).end()
        }

    } catch (error) {
        next(error);
    }
}

module.exports = {
    getAllCustomers,
    createCustomer,
    deleteAllCustomers,

    getOneCustomer,
    updateOrCreateCustomer,
    updateCustomer,
    deleteOneCustomer,
}

