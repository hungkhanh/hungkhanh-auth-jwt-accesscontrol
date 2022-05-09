import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import ejs from 'ejs';

import path from 'path';

import verifyToken from './middlewares/auth';

const app = express();
const corOptions = {
    origin: 'https://localhost:8081',
}

// middlewares
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors(corOptions));
app.use(express.json());

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// routers
import customersRouter from './routes/customersRouter';
import employeesRouter from './routes/employeesRouter';
import usersRouter from './routes/usersRouter';

app.use('/customers', verifyToken, customersRouter);
app.use('/employees', verifyToken, employeesRouter);
app.use('/users', usersRouter);

// test api
app.get('/', (req, res) => {
    res.status(200).json({
        success: true,
        data: 'hellp from api'
    });
});

// port
const PORT = process.env.PORT || 8080;

// server
app.listen(PORT, (req, res) => {
    console.log(`Server started on port ${PORT}`);
});