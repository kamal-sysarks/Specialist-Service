const request = require('supertest');
const app = require('./../server/server');

const { specialistOne, setUpDB} = require('./mock_db');

beforeEach(setUpDB)

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
        "email": specialistOne.email,
        "password": specialistOne.password
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
        .set('Authorization', `Bearer ${specialistOne.tokens[0].token}`)
        .send()
        .expect(200)

})