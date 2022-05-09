import db from '../models';
import accesscontrol from '../policy/role';

const User = db.users
const Employee = db.employees
const Customer = db.customers

// 1. get all customers
const getAllCustomers = async (req, res) => {
    try {
        const customers = await Customer.findAll({});
        res.status(200).send(customers);    
    } catch (error) {
        console.log(error);
    }
}

// 2. create a customer
const createCustomer = async (req, res) => {
    const data = req.body;
    try {
        const customer = await Customer.create(data);
        res.status(201).json({
            success: true,
            data: customer
        })
    } catch (error) {
        console.log(error);
    }
}

// 3. delete all customers
const deleteAllCustomers = async (req, res) => {
    try {
        await Customer.truncate();
        res.status(200).json({
            success: true,
            message: "Delete all customers"
        });
    } catch (error) {
        console.log(error);
    }
}

// 4. get one customer by Id
const getOneCustomer = async (req, res) => {
    const customerNumber = req.params.customerNumber;
    try {
        const customer = await Customer.findByPk(customerNumber);
        res.status(200).send(customer);
    } catch (error) {
        console.log(error);
    }
}

// 5. update info customer PUT by Id
const updateOrCreateCustomer = async (req, res) => {
    const customerNumber = req.params.customerNumber;
    const data = req.body;
    try {
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
    } catch (error) {
        console.log(error);
    }
}

// 6. update info customer PATCH by Id
const updateCustomer = async (req, res) => {
    const customerNumber = req.params.customerNumber;
    const data = req.body;
    try {
        const customer = await Customer.update(data, { where: { customerNumber: customerNumber}});
        res.status(200).json({
            success: true,
            message: "Update a customer",
            data: customer
        });
    } catch (error) {
        console.log(error);
    }
}

// 7. delete one customer by Id
const deleteOneCustomer = async (req, res) => {
    const customerNumber = req.params.customerNumber;
    try {
        await Customer.destroy({ where: { customerNumber: customerNumber}});
        res.status(200).json({
            success: true,
            message: "Delete a customer"
        });
    } catch (error) {
        console.log(error);
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

