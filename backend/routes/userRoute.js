// router.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const foodController = require('../controllers/foodController')
const trakcerController = require('../controllers/trackerController')
const workoutController = require('../controllers/workoutController')
const planController = require('../controllers/planController')
const Trainaercontroller = require('../controllers/userTrainerController')
const chatController = require('../controllers/userChatController')
const trainerController = require('../controllers/trainerController')
const BlogController = require('../controllers/blogController')
const jwtAuth = require('../middleware/auth');
const { checkAuth } = require('../middleware/auth');

router.get('/', userController.loadIndex);
router.post('/signup',userController.postSignup)
router.post('/verifyotp',userController.verifyOTP)
router.post('/verifyLogin', userController.verifyLogin)
router.post('/forgotpassword', userController.forgotPassword)
router.post('/resetpassword',userController.resetPassword)
router.post('/resendotp', userController.resendOtp)
router.post('/updateprofile',jwtAuth, userController.updateProfile)
router.get('/checkprofile',jwtAuth,userController.checkFilled)
router.get('/isblocked',jwtAuth,userController.isBlocked)
router.post('/updateweight', jwtAuth,userController.updateWeight)
router.get('/getweighthistory',jwtAuth, userController.getWeightHistory)
router.get('/loadfood',jwtAuth, foodController.loadFood)
router.post('/addfoodtouser',jwtAuth, foodController.addFoodTouser)
router.get('/getuser',jwtAuth,trakcerController.getUser)
router.get('/getuserfoodhistoory',jwtAuth, trakcerController.getUserFoodHistory)
router.get('/weighthistorytracker',jwtAuth,trakcerController.weightHistoryTracker)
router.get('/deletefoodentry',jwtAuth,foodController.removeFoodHistory)
router.get('/deleteweightentry',jwtAuth,trakcerController.removeWeightEntry)
router.post('/addworkout',jwtAuth,workoutController.addWorkout)
router.get('/getworkouthistory',jwtAuth,workoutController.getWorkoutHistory)
router.get('/removeworkout',jwtAuth,workoutController.remveWorkoutEntry)
router.get('/getplans', jwtAuth,planController.getPlan)
router.post('/userplanupdate',jwtAuth, planController.userPlanUpdate)
router.get('/checkssubscription', jwtAuth,planController.checkSubscription)
router.get('/gettrianers',Trainaercontroller.gettrianers)
router.get('/getTrainerbyid',Trainaercontroller.gettrainerById)
router.get('/getuserplan',planController.getUserPlan)
router.get('/subscribetrainer', jwtAuth,Trainaercontroller.subscribeTrainer )
router.get('/getsubscribedtrainer', jwtAuth,Trainaercontroller.getSubscribedTrainer)
router.get('/updateduserlist',jwtAuth,trainerController.getUsers)
router.get('/searchtrainer',jwtAuth,Trainaercontroller.traienrSearch)
router.get('/getblogs',jwtAuth,BlogController.getBlogs)

router.get('/getroom',jwtAuth,chatController.getRoomUser)
router.post('/create-new-chat',jwtAuth, chatController.sendMessage)
router.get('/fetch-chatbyid', jwtAuth,chatController.getAllChats);
router.get('/fetch-chat',jwtAuth,chatController.getAllchatsforUser)
router.get('/readmessage', jwtAuth,chatController.messageRead)
module.exports = router;
