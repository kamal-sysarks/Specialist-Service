const multer = require('multer');
const auth = require('../models/auth');
const sharp = require('sharp');
const Specialist = require("../models/users");

module.exports = (app, options) => {
    app.post('/registerSpecialist', async (req, res) => {
      await options.specialistRegister(req.body)
        .then(result => {
          res.status(200).send(result);
        }).catch(err => {
          res.send(err);
        });
    })

    app.post('/loginSpecialist', async (req, res, next) => {
      await options.specialistLogin(req.body)
        .then(result => {
          if(!result){
            return res.status(404).send("User doesn't exists");
          }
          res.status(200).send(result);
        }).catch(err => {
          res.status(500).send(err);
        }).catch(next);
    })

    app.post('/logoutSpecialist', auth, async (req, res) => {
      try { 
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token;
        });
        await req.user.save();
        res.send('User logged out');
      } catch (error) {
        res.status(500).send('Something Went Wrong'+ error)
      }
    })

    app.post('/logoutSpecialistAll', auth, async (req, res) => {
      try { 
        req.user.tokens = [];
        await req.user.save();
        res.send('User logged out from All Devices.');
      } catch (error) {
        res.status(500).send('Something Went Wrong'+ error)
      }
    })
  
    app.get('/getAllSpecialist', auth, async (req, res) => {
      await options.allSpecialist()
        .then(result => {
          res.status(200).send(result);
        }).catch(err => {
          res.send(err);
        })
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

    app.post('/specialist/profile', auth, upload.single('avatar'), async (req, res) => {
        const buffer = await sharp(req.file.buffer).resize({width: 320, height:320}).png().toBuffer();   
      
      req.user.avatar = buffer;
        await req.user.save();
        res.send();
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