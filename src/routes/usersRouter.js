import express from "express";
import { celebrate, Segments } from "celebrate";
import usersSchema from '../validation/usersValidation'
import usersController from '../controllers/usersController';

import Joi from "joi";
const router = express.Router();

router.route('/register')
    .get(usersController.registerGet)
    .post(celebrate({
        body: usersSchema
    }),
        usersController.createUser
    )

router.route('/login')
    .get(usersController.loginGet)
    .post(celebrate({
        body: usersSchema
    }),
    usersController.loginPost)

router.route('/info')
    .get(usersController.infoGet)

module.exports = router;