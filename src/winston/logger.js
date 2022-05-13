import winston, { transport } from 'winston';
import  'winston-daily-rotate-file';

const { combine, timestamp, label, printf, colorize, errors } = winston.format;

const logger = winston.createLogger({
    level: 'info',
    format: combine(
        colorize(),
        label({ label: ['LOG'] }),
        timestamp(),
        printf(({ level, message, label, timestamp, stack }) => {
            return `${timestamp} [${label}] ${level}: ${stack || message}`;
        }),
        errors({ stack: true})
    ),
    transports: [
        new winston.transports.File({ filename: './log/error.log', level: 'error' }),
        new winston.transports.File({ filename: './log/info.log', level: 'info' }),
    ]
})

module.exports = logger;


