import db from '../models';

const User = db.users
const Employee = db.employees
const Customer = db.customers

// 1. GET login
const loginGet = (req, res) => {

}

// 2. POST login: auth user
// @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
// const createUser = async (req, res) => {
//     const data = req.body;
//     try {
//         const user = await User.create(data);
//         res.status(201).json({
//             success: true,
//             message: "create a new user"
//         });
//     } catch (error) {
//         console.log(error);
//     }
// }

// 3. GET register
const registerGet = (req, res) => {

}

// 4. POST register: create user
// @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
// use bcrypt
const createUser = async (req, res) => {
    const data = req.body;
    try {
        const user = await User.create(data);
        res.status(201).json({
            success: true,
            message: "create a new user"
        });
    } catch (error) {
        console.log(error);
    }
}