const winston = require('winston');

const transports = [
  new winston.transports.Console({
    format: process.env.NODE_ENV === 'production' 
      ? winston.format.json() 
      : winston.format.simple(),
  })
];

const exceptionHandlers = [
  new winston.transports.Console()
];

const rejectionHandlers = [
  new winston.transports.Console()
];

if (process.env.NODE_ENV !== 'production') {
  transports.push(
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' })
  );
  
  exceptionHandlers.push(
    new winston.transports.File({ filename: 'logs/exceptions.log' })
  );
  
  rejectionHandlers.push(
    new winston.transports.File({ filename: 'logs/rejections.log' })
  );
}

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  defaultMeta: { service: 'user-service' },
  transports: transports,
  exceptionHandlers: exceptionHandlers,
  rejectionHandlers: rejectionHandlers
});

module.exports = logger;