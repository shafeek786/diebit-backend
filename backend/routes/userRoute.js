// router.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const foodController = require('../controllers/foodController')
const trakcerController = require('../controllers/trackerController')
const workoutController = require('../controllers/workoutController')
const planController = require('../controllers/planController')
const Trinaercontroller = require('../controllers/userTrainerController')

router.get('/', userController.loadIndex);
router.post('/signup',userController.postSignup)
router.post('/verifyotp',userController.verifyOTP)
router.post('/verifyLogin', userController.verifyLogin)
router.post('/forgotpassword', userController.forgotPassword)
router.post('/resetpassword',userController.resetPassword)
router.post('/resendotp', userController.resendOtp)
router.post('/updateprofile', userController.updateProfile)
router.get('/checkprofile',userController.checkFilled)
router.get('/isblocked',userController.isBlocked)
router.post('/updateweight', userController.updateWeight)
router.get('/getweighthistory', userController.getWeightHistory)
router.get('/loadfood', foodController.loadFood)
router.post('/addfoodtouser', foodController.addFoodTouser)
router.get('/getuser',trakcerController.getUser)
router.get('/getuserfoodhistoory', trakcerController.getUserFoodHistory)
router.get('/weighthistorytracker',trakcerController.weightHistoryTracker)
router.get('/deletefoodentry',foodController.removeFoodHistory)
router.get('/deleteweightentry',trakcerController.removeWeightEntry)
router.post('/addworkout',workoutController.addWorkout)
router.get('/getworkouthistory',workoutController.getWorkoutHistory)
router.get('/removeworkout',workoutController.remveWorkoutEntry)
router.get('/getplans', planController.getPlan)
router.post('/userplanupdate', planController.userPlanUpdate)
router.get('/checkssubscription', planController.checkSubscription)
router.get('/gettrianers',Trinaercontroller.gettrianers)
router.get('/getTrainerbyid',Trinaercontroller.gettrainerById)
router.get('/getuserplan',planController.getUserPlan)
module.exports = router;
