const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const Specialist = require('../models/users');

const specialistOneId = new mongoose.Types.ObjectId();
const specialistOne = {
    _id: specialistOneId,
    "name": "Dr Parth",
    "email": "parth@g.com",
    "password": "parth12345",
    "phone": 8989899898,
    "specialization":"Cardio",
    "highestDegree":"MD",
    "medlicensenum":"123446",
    tokens: [{
        token: jwt.sign({_id: specialistOneId}, process.env.JWT_SECRET)
    }]     
}

const specialistTwoId = new mongoose.Types.ObjectId();
const specialistTwo = {
    _id: specialistTwoId,
    "name": "Dr Karan",
    "email": "karan@g.com",
    "password": "karan12345",
    "phone": 8989899898,
    "specialization":"Cardio",
    "highestDegree":"MD",
    "medlicensenum":"123446",
    tokens: [{
        token: jwt.sign({_id: specialistTwoId}, process.env.JWT_SECRET)
    }]        
}

const specialistThreeId = new mongoose.Types.ObjectId();
const specialistThree = {
    _id: specialistThreeId,
    "name": "Dr Rohith",
    "email": "rohit@g.com",
    "password": "rohit12345",
    "phone": 8989899898,
    "specialization":"Cardio",
    "highestDegree":"MD",
    "medlicensenum":"123446",
    tokens: [{
        token: jwt.sign({_id: specialistThreeId}, process.env.JWT_SECRET)
    }]        
}

const setUpDB = async () => {
    await Specialist.deleteMany();
    await new Specialist(specialistOne).save();
    await new Specialist(specialistTwo).save();
    await new Specialist(specialistThree).save();
}

module.exports = {
    specialistOne,
    setUpDB
}