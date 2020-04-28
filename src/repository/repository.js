'use strict'
const Specialist = require("../models/users");
const logger = require('./../config/logger').logger;

const repository = (db) => {
  
  const signUpSpecialist = async (specialist) => {
    try {
      const user = new Specialist(specialist);
      const savedUser =  await user.save();
      const token = await user.generateAuthToken();
      logger.info(`Specialist Signed Up.`);
      return {savedUser, token};
    } catch (error) {
      console.log(error);
      logger.error(`Error: Signing Up Specialist ${error}`);
      throw new Error(error);
    }
  }

  const signInSpecialist = async (specialist) => {
    try{
      const user = await Specialist.findByCredentials(specialist.email, specialist.password);
      const token = await user.generateAuthToken();
      logger.info(`Specialist Signed In.`);
      return {user, token};
    }catch(error){
      console.log("error:" + error);
      logger.error(`Error: Signing In Specialist ${error}`);
      throw new Error(error);
    }
  }

  const signOutPatient = async (specialist) => {
    try {
        const tokensCount =  specialist.user.tokens.length;
        specialist.user.tokens = specialist.user.tokens.filter((token) => {
        return token.token !== specialist.token;
      });
      const user = await specialist.user.save();
      const message = user.tokens.length<tokensCount ? 'User Signed Out Successfully' : '';
      logger.info(message);
      return message;
    } catch (error) {
      console.log("Error" + error);
      logger.error(`Error: Signing Out Specialist ${error}`);
      throw new Error(error);
    }
  }

  const getSpecialistsList = async () => {
    try {
      const specialists = await Specialist.find({});
      logger.info(`Getting All Specialists List`);
      return specialists;  
    } catch (error) {
      console.log("error:" + error);
      logger.error(`Error: Getting All Specialists List ${error}`);
      throw new Error(error);
    }
  }

  const disconnect = () => {
    db.close()
  }

  const obj = Object.create({
    signUpSpecialist,
    signInSpecialist,
    getSpecialistsList,
    signOutPatient,
    disconnect
  })
 // console.log(obj.patientRegister);
  return obj;
}

const connect = (connection) => {
  return new Promise((resolve, reject) => {
    if (!connection) {
      reject(new Error('connection db not supplied!'))
    }
   // console.log(connection);
    resolve(repository(connection));
    
  })
}

module.exports = Object.assign({}, {connect})
