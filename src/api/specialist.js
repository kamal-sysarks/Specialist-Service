const express = require('express');
const router = new express.Router();
const auth = require('../models/auth');
const options = require('./../repository/repository');

    router.post('/signUpSpecialist', async (req, res) => {
      try {
        const result = await options.signUpSpecialist(req.body)
        res.status(201).send(result);
      } catch (error) {
        res.status(500).send({error: error.message});
      }
    })

    router.post('/signInSpecialist', async (req, res) => {
      try {
        const result = await options.signInSpecialist(req.body)
        res.status(200).send(result);
      } catch (error) {
        res.status(404).send({error: error.message});
      }
    })

    router.get('/signOutSpecialist', auth, async (req, res) => {
        try {
          const user = await options.signOutSpecialist(req);
          if(user === ''){
            res.status(500).send('Something Went Wrong');
          }
          res.status(200).send(user);
        } catch (error) {
          res.status(500).send('Error: '+ error)
        }
    })

    
    router.get('/getSpecialistsList',  async (req, res) => {
      try {
        const result = await options.getSpecialistsList()
        res.status(200).send(result);
      } catch (error) {
        res.status(404).send({error: error.message});
      }
    })

  module.exports = router;