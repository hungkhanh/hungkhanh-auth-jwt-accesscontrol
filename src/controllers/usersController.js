import dotenv from 'dotenv';
dotenv.config();
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import db from '../models';
import logger from '../winston/logger';

const User = db.users

// 1. GET login
const loginGet = (req, res, next) => {
    logger.log('info', 'GET login');
    res.status(200).render('login', { title: 'Login' });
}

// 2. POST login: auth user
const loginPost = async (req, res, next) => {
    const data = req.body;
    logger.log('info', 'POST login');
    try {
        const user = await User.findByPk(data.username);
        if(!user) {
            return res.sendStatus(401);
        }
        const result = await comparePromise(data.password, user.password);
        if(result === true) {
            const accessToken = jwt.sign(user.username, process.env.ACCESS_TOKEN_SECRET);
            console.log(`Token: ${accessToken}`);
            res.cookie('jwt_token', accessToken);
            res.status(200).json({
                success: true,
                token: accessToken
            })
        }
    } catch (error) { 
        next(error);
    }
}

// 3. GET register
const registerGet = (req, res, next) => {
    logger.log('info', 'GET register');
    res.status(200).render('register', { title: 'Register' });
}

// 4. POST register: create user
const createUser = async (req, res, next) => {
    const data = req.body;
    delete data['re-password'];
    logger.log('info', 'POST register');
    try {
        const salt = await genSaltPromise();
        const hash = await hashPasswordPromise(data.password, salt);
        data.password = hash;
        const user = await User.create(data);
        const accessToken = jwt.sign(user.username, process.env.ACCESS_TOKEN_SECRET);
        console.log(`Token: ${accessToken}`);
        res.cookie('jwt_token', accessToken);
        res.status(201).redirect('/users/info');
    } catch (error) { 
        next(error);
    }
}

// 5. GET info
const infoGet = (req, res, next) => {
    logger.log('info', 'GET info');
    res.status(200).render('info', { title: 'Infomation' });
}

// const dashboardGet = (req, res, next) => {
//     res.status(200).render('dashboard', { title: 'Dashboard' });
// }


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

    infoGet
}