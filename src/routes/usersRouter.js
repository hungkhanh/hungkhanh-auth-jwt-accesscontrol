import express from "express";
import { celebrate, Segments } from "celebrate";
import usersSchema from '../validation/usersValidation'
import usersController from '../controllers/usersController';

import Joi from "joi";
const router = express.Router();



router.get('/register', usersController.registerGet);

router.post('/register', celebrate({
        body: usersSchema
    }), 
        usersController.createUser
);

router.get('/login', usersController.loginGet);

router.post('/login', celebrate({
        body: usersSchema
    }),
        usersController.loginPost
)

router.get('/info', usersController.infoGet)

module.exports = router;