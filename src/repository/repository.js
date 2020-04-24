'use strict'
const Specialist = require("../models/users");

const repository = (db) => {
  
  const specialistRegister = async (specialist) => {
    try {
      const user = new Specialist(specialist);
      const savedUser =  await user.save();
      const token = await user.generateAuthToken();
      return {savedUser, token};
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  const specialistLogin = async (specialist) => {
    try{
      const user = await Specialist.findByCredentials(specialist.email, specialist.password);
      const token = await user.generateAuthToken();
      return {user, token};
    }catch(error){
      console.log("error:" + error);
      return error;
    }
  }

  const allSpecialist = async () => {
    try {
      const specialists = await Specialist.find({});
      return specialists;  
    } catch (error) {
      console.log("error:" + error);
      return error;
    }
  }

  const disconnect = () => {
    db.close()
  }

  const obj = Object.create({
    specialistRegister,
    specialistLogin,
    allSpecialist,
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
