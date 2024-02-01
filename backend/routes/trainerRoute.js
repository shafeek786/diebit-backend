const express = require('express')
const routeTrainer = express.Router()
const trainerController = require('../controllers/trainerController')
const blogController = require('../controllers/blogController')
const TimeScheduleController = require('../controllers/trainerTimeSchedulController')

routeTrainer.use(express.urlencoded({extended:true}))
routeTrainer.use(express.json())

routeTrainer.post('/verifylogin', trainerController.verifyLogin)
routeTrainer.post('/signup', trainerController.signUp)
routeTrainer.post('/addblog', blogController.addBlog)
routeTrainer.get('/getblog', blogController.getBlog)
routeTrainer.post('/addtimeslot', TimeScheduleController.addTime)
routeTrainer.get('/getslot',TimeScheduleController.getSlot)
routeTrainer.get('/cancelslot', TimeScheduleController.cancelSlot)
routeTrainer.get('*',function(req,res){
    res.redirect('/trainer')
})
module.exports = routeTrainer