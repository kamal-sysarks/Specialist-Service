const multer = require('multer');
const auth = require('../models/auth');
const sharp = require('sharp');
const Specialist = require("../models/users");

module.exports = (app, options) => {
    app.post('/signUpSpecialist', async (req, res) => {
      try {
        const result = await options.signUpSpecialist(req.body)
        res.status(201).send(result);
      } catch (error) {
        res.status(500).send({error: error.message});
      }
    })

    app.post('/signInSpecialist', async (req, res) => {
      try {
        const result = await options.signInSpecialist(req.body)
        res.status(200).send(result);
      } catch (error) {
        res.status(404).send({error: error.message});
      }
    })

    app.get('/signOutSpecialist', auth, async (req, res) => {
      // try { 
      //     const user = await options.signOutSpecialist(req);
      //     if(user === ''){
      //       res.status(500).send('Something Went Wrong');
      //     }
      //     res.status(200).send(user);
      //   } catch (error) {
      //     res.status(500).send('Error: '+ error)
      //   }
        try {
          const user = await options.signOutPatient(req);
          if(user === ''){
            res.status(500).send('Something Went Wrong');
          }
          res.status(200).send(user);
        } catch (error) {
          res.status(500).send('Error: '+ error)
        }
    })

    app.post('/signOutSpecialistAll', auth, async (req, res) => {
      try { 
        req.user.tokens = [];
        await req.user.save();
        res.send('User logged out from All Devices.');
      } catch (error) {
        res.status(500).send('Something Went Wrong'+ error)
      }
    })
  
    app.get('/getSpecialistsList',  async (req, res) => {
      try {
        const result = await options.getSpecialistsList()
        res.status(200).send(result);
      } catch (error) {
        res.status(404).send({error: error.message});
      }
    })

    const upload = multer({
      limits: {
        fileSize: 1000000
      },
      fileFilter(req, file, cb){
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/)){
          return cb(new Error("Please upload an image"));
        }
        cb(undefined, true);
      }      
    })

    app.post('/specialist/avatar', auth, upload.single('avatar'), async (req, res) => {
        const buffer = await sharp(req.file.buffer).resize({width: 320, height:320}).png().toBuffer();   
      
      req.user.avatar = buffer;
        await req.user.save();
        res.status(201).send("Profile Pic Uploaded.");
     },(error, req, res, next) =>{
        res.status(400).send({error: error.message});
     })

    app.get('/specialist/:id/avatar', async (req, res) => {
      try{
        const user = await Specialist.findById(req.params.id);

        if(!user || !user.avatar){
          throw new Error();
        }

        res.set('Content-Type', 'image/png');
        res.send(user.avatar);

      }catch(error){
        console.log(error);
        res.status(404).send();
      }
    });
  }