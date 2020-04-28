'use strict'
require('dotenv').config();
const {EventEmitter} = require('events');
const server = require('./server/server');
const repository = require('./repository/repository');
const config = require('./config/');
const mediator = new EventEmitter();

const logger = require('./config/logger').logger;

console.log('--- Specialist Service ---')
console.log('Connecting to Specialist repository...')

process.on('uncaughtException', (err) => {
  console.error('Unhandled Exception', err)
})

process.on('uncaughtRejection', (err, promise) => {
  console.error('Unhandled Rejection', err)
})

mediator.on('db.ready', (db) => {
  let rep;
  repository.connect(db)
    .then(repo => {
      console.log('Connected. Starting Server');
      logger.info("DB Connected to Repository. Starting Server.")
      rep = repo;
      return server.start({
        port: config.serverSettings.port,
        repo
      })
    })
    .then(app => {
      console.log(`Server started successfully, running on port: ${config.serverSettings.port}.`);
      logger.info(`Server started successfully, running on port: ${config.serverSettings.port}.`);
      app.on('close', () => {
        rep.disconnect();
        logger.info(`Disconnect Server with Repository.`);
      })
    })
    .catch(error => {
      console.log(error);
      logger.error(`Error: ${error.message}`)
    })
})


config.db.connect(config.dbSettings,mediator);


