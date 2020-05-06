const Specialist = require("../models/users");
const logger = require('../db/logger').logger;

  
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

  const signOutSpecialist = async (specialist) => {
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
      logger.info(`Getting Specialists List`);
      return specialists;  
    } catch (error) {
      console.log("error:" + error);
      logger.error(`Error: Getting Specialists List ${error}`);
      throw new Error(error);
    }
  }

  const obj = Object.create({
    signUpSpecialist,
    signInSpecialist,
    getSpecialistsList,
    signOutSpecialist
  })

module.exports =  obj;
