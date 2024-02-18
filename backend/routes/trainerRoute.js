const express = require('express')
const routeTrainer = express.Router()
const trainerController = require('../controllers/trainerController')
const blogController = require('../controllers/blogController')
const TimeScheduleController = require('../controllers/trainerTimeSchedulController')
const chatController = require('../controllers/userChatController')
const chatUpdate = require('../controllers/trainerChatController')
const walletController = require('../controllers/trainerWalletController')
const multer = require('multer')
const jwtAuth = require('../middleware/auth');
const cloudinary = require('cloudinary').v2;

          
cloudinary.config({ 
  cloud_name: 'dipcubpap', 
  api_key: '273187588799525', 
  api_secret: 'HeMdf7pGUHSKPFnZ0_VP8ETMYq4' 
});

const path = require('path');
const router = require('./userRoute')

const storage = multer.diskStorage({
    filename: function (req,file,cb) {
      cb(null, file.originalname)
    }
  });
  

const upload = multer({ storage: storage });

routeTrainer.use(express.urlencoded({extended:true}))
routeTrainer.use(express.json())

routeTrainer.post('/verifylogin', trainerController.verifyLogin)
routeTrainer.post('/signup',upload.fields([{name:'image',maxCount:1}]), trainerController.signUp)
routeTrainer.post('/addblog',jwtAuth,upload.fields([{name:'image',maxCount:1}]), blogController.addBlog)
routeTrainer.get('/getblog',jwtAuth, blogController.getBlog)
routeTrainer.post('/addtimeslot',jwtAuth, TimeScheduleController.addTime)
routeTrainer.get('/getslot',jwtAuth,TimeScheduleController.getSlot)
routeTrainer.get('/cancelslot', jwtAuth,TimeScheduleController.cancelSlot)
routeTrainer.get('/trainerdetails',jwtAuth,trainerController.getTrainer)
routeTrainer.post('/updatetrainer',jwtAuth,trainerController.updateTrainer)
routeTrainer.post('/uploadprofilepic',jwtAuth,upload.fields([{name:'image',maxCount:1}]),trainerController.profilePicUpload)
routeTrainer.get('/getusers',jwtAuth,trainerController.getUsers)
routeTrainer.get('/deleteblog',jwtAuth,blogController.deleteBlog)
routeTrainer.get('/getblogbyid',jwtAuth,blogController.getBlogById)
routeTrainer.post('/updateblog',jwtAuth,blogController.updateBlog)
routeTrainer.post('/updateblogwithimage',jwtAuth,upload.fields([{name:'image',maxCount:1}]),blogController.updateBlogWithImage)
routeTrainer.get('/getsubscribeduser',jwtAuth,trainerController.getSubscribedUser)
routeTrainer.get('/searchsubscribeduser',jwtAuth,trainerController.getSubscribedUserSearch)


routeTrainer.get('/getroom',jwtAuth,chatController.getChatRooms)
routeTrainer.post('/create-new-chat',jwtAuth, chatController.sendMessage)
routeTrainer.get('/fetch-chatbyid', jwtAuth,chatController.getAllChats);
routeTrainer.get('/readmessage', jwtAuth,chatController.messageRead)
routeTrainer.get('/getupdatedtrainerlist', jwtAuth,chatUpdate.getSubscribedTrainer)

routeTrainer.get('/getwalletbalance',jwtAuth,walletController.getWalletBallence)
routeTrainer.get('/getwalletjistory', walletController.getWalletHistory)

routeTrainer.get('*',function(req,res){
    res.redirect('/trainer')
})
module.exports = routeTrainer