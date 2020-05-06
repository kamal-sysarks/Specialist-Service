const request = require('supertest');
const app = require('./../server/server');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const User = require('./../models/users');

const userOneId = new mongoose.Types.ObjectId();
const userOne = {
    _id: userOneId,
    "name": "Dr Basavaraj",
    "email": "bassu@g.com",
    "password": "bassu12345",
    "phone": 8989899898,
    "specialization":"Cardio",
    "highestDegree":"MD",
    "medlicensenum":"123446",
    tokens: [{
        token: jwt.sign({_id: userOneId}, process.env.JWT_SECRET)
    }]
}

beforeEach(async () => {
    await User.deleteMany();
    await new User(userOne).save();
})

test("Should signup a new user", async () => {
    // console.log(server);
    await request(app).post('/signUpSpecialist').send({
        "name": "Dr Manohar Nayak",
        "email": "manohar@g.com",
        "password": "manohar12345",
        "phone": 8989899898,
        "specialization":"Cardio",
        "highestDegree":"MD",
        "medlicensenum":"123446"
    }).expect(201)
})

test("Should login a user", async () => {
    await request(app).post('/signInSpecialist').send({
        "email": userOne.email,
        "password": userOne.password
    }).expect(200)
})

test("Should not login non existing User", async () => {
    await request(app).post('/signInSpecialist').send({
        "email": "manohar@g.com",
        "password": "manohar12345"
    }).expect(404)
})

test("Should get Specialists List from DB", async () => {
    await request(app).get('/getSpecialistsList').expect(200);
})

test("Should logout a user", async () => {
    await request(app).get('/signOutSpecialist')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)

})