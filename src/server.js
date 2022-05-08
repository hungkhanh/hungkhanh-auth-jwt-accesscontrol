import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import ejs from 'ejs';

import path from 'path';

const app = express();
const corOptions = {
    origin: 'https://localhost:8081',
}

// middlewares
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors(corOptions));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// routers

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