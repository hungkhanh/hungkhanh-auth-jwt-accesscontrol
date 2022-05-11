import express from "express";

import usersController from '../controllers/usersController';

const router = express.Router();

router.route('/register')
    .get(usersController.registerGet)
    .post(usersController.createUser)

router.route('/login')
    .get(usersController.loginGet)
    .post(usersController.loginPost)

router.route('/info')
    .get(usersController.infoGet)

module.exports = router;