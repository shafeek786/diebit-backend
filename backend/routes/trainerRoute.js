const express = require('express')
const routeTrainer = express.Router()
const trainerController = require('../controllers/trainerController')
const blogController = require('../controllers/blogController')
const TimeScheduleController = require('../controllers/trainerTimeSchedulController')
const multer = require('multer')
const cloudinary = require('cloudinary').v2;

          
cloudinary.config({ 
  cloud_name: 'dipcubpap', 
  api_key: '273187588799525', 
  api_secret: 'HeMdf7pGUHSKPFnZ0_VP8ETMYq4' 
});

const path = require('path');

const storage = multer.diskStorage({
    filename: function (req,file,cb) {
      cb(null, file.originalname)
    }
  });
  

const upload = multer({ storage: storage });

routeTrainer.use(express.urlencoded({extended:true}))
routeTrainer.use(express.json())

routeTrainer.post('/verifylogin', trainerController.verifyLogin)
routeTrainer.post('/signup', trainerController.signUp)
routeTrainer.post('/addblog', blogController.addBlog)
routeTrainer.get('/getblog', blogController.getBlog)
routeTrainer.post('/addtimeslot', TimeScheduleController.addTime)
routeTrainer.get('/getslot',TimeScheduleController.getSlot)
routeTrainer.get('/cancelslot', TimeScheduleController.cancelSlot)
routeTrainer.get('/trainerdetails',trainerController.getTrainer)
routeTrainer.post('/updatetrainer',trainerController.updateTrainer)
routeTrainer.post('/uploadprofilepic',upload.fields([{name:'image',maxCount:1}]),trainerController.profilePicUpload)

routeTrainer.get('*',function(req,res){
    res.redirect('/trainer')
})
module.exports = routeTrainer