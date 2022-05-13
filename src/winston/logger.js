import winston, { transport } from 'winston';
import  'winston-daily-rotate-file';

const { combine, timestamp, label, printf, colorize, errors } = winston.format;

const logger = winston.createLogger({
    level: 'info',
    format: combine(
        // colorize({
        //     all: false,
        //     message: false,
        //     level: false
        // }),
        label({ label: ['LOG'] }),
        timestamp(),
        printf(({ level, message, label, timestamp }) => {
            return `${timestamp} [${label}] ${level}: ${message}`;
        }),
        errors({ stack: true})
    ),
    transports: [
        new winston.transports.File({ filename: './log/error.log', level: 'error' }),
        new winston.transports.File({ filename: './log/info.log', level: 'info' }),
    ]
})

module.exports = logger;


