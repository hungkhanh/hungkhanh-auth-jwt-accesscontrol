import dotenv from 'dotenv';
dotenv.config();
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import db from '../models';

const User = db.users
const Employee = db.employees
const Customer = db.customers

// 1. GET login
const loginGet = (req, res) => {
    res.status(200).render('login', { title: 'Login' });
}

// 2. POST login: auth user
const loginPost = async (req, res) => {
    const data = req.body;
    try {
        const user = await User.findByPk(data.username);        
        const result = await comparePromise(data.password, user.password);
        console.log(`result: ${result}`); // OK
        // res.status(201).json({
        //     success: true,
        //     message: "create a new user"
        // });
    } catch (error) {
        console.log(error);
    }
}

// 3. GET register
const registerGet = (req, res) => {
    res.status(200).render('register', { title: 'Register' });
}

// 4. POST register: create user
const createUser = async (req, res) => {
    const data = req.body;
    delete data['re-password'];
    try {
        const salt = await genSaltPromise();
        const hash = await hashPasswordPromise(data.password, salt);
        data.password = hash;
        const user = await User.create(data);
        res.status(201).json({
            success: true,
            message: "create a new user"
        });
    } catch (error) {
        console.log(error);
    }
}

// 5. GET info
const infoGet = (req, res) => {
    res.status(200).render('info', { title: 'Infomation' });
}

// 6. POST info
const infoPost = async (req, res) => {
    const data = req.body;
    console.log(data);
}

// use promise bcrypt
function genSaltPromise() {
    const saltRounds = 10;
    return new Promise((resolve, reject) => {
        bcrypt.genSalt(saltRounds, function(err, salt) {
            if(!err) {
                resolve(salt);
            } else {
                reject(err);
            }
        })
    });
}

function hashPasswordPromise(plaintextPassword, salt) {
    return new Promise((resolve, reject) => {
        bcrypt.hash(plaintextPassword, salt, function(err, hash) {
            if(!err) {
               resolve(hash);
            } else {
               reject(err);
            }
        });
    });
}

function comparePromise(plaintextPassword, hash) {
    return new Promise((resolve, reject) => {
        bcrypt.compare(plaintextPassword, hash, function(err, result) {
            if(!err) {
                resolve(result);
            } else {
                reject(err);
            }
        })
    });
}

module.exports = {
    loginGet,
    loginPost,

    registerGet,
    createUser,

    infoGet,
    infoPost,
}