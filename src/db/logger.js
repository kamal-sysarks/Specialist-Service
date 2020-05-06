const winston = require('winston');
require('winston-mongodb');
const {dbSettings} = require('../db/config');


const options = {
  
  database: {
    db: dbSettings.db,
    options: {useUnifiedTopology: true},
    level : 'info',
    collection: 'specialist_log',
    prettyPrint: true,
    handleExceptions: true,
    humanReadableUnhandledException: true,
    datePattern: 'YYYY-MM-DD',
    format: winston.format.combine(
      winston.format.timestamp({
        format: 'YYYY-MM-DD HH:mm:ss'
      }),
      winston.format.json()
    )
  }
};

module.exports.logger = new winston.createLogger({
  transports: [
    new winston.transports.MongoDB(options.database)
  ],
  exitOnError: false, // do not exit on handled exceptions
});