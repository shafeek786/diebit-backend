const express = require('express')
const routeTrainer = express.Router()
const trainerController = require('../controllers/trainerController')
const blogController = require('../controllers/blogController')

routeTrainer.use(express.urlencoded({extended:true}))
routeTrainer.use(express.json())

routeTrainer.post('/verifylogin', trainerController.verifyLogin)
routeTrainer.post('/signup', trainerController.signUp)
routeTrainer.post('/addblog', blogController.addBlog)
routeTrainer.get('/getblog', blogController.getBlog)

routeTrainer.get('*',function(req,res){
    res.redirect('/trainer')
})
module.exports = routeTrainer