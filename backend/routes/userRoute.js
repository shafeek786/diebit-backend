// router.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const foodController = require('../controllers/foodController')
const trakcerController = require('../controllers/trackerController')

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

module.exports = router;
