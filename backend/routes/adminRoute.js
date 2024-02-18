const express = require('express');
const routerAdmin = express.Router()
const adminController = require('../controllers/adminController');
const router = require('./userRoute');
const trainerManageController = require('../controllers/trainerManagementcontroller')
const foodController = require('../controllers/foodController')
const planController = require('../controllers/planController')
const jwtAuth = require('../middleware/auth');

routerAdmin.use(express.urlencoded({extended:true}))
routerAdmin.use(express.json())





routerAdmin.post('/verifylogin',adminController.verifyLogin)
routerAdmin.get('/trainerdashboard',jwtAuth, adminController.loadTrainerDashboard)
routerAdmin.get('/userdashboard',jwtAuth, adminController.loadUserDashboard)
routerAdmin.post('/search',jwtAuth,adminController.loadSearch)
routerAdmin.get('/toggleBlock',jwtAuth,adminController.toggleBlock)
routerAdmin.get('/toggleBlockTrainer',jwtAuth, adminController.toggleBlockTrainer)
routerAdmin.get('/trainerStatusChange',jwtAuth, adminController.trainerStatusChange)
routerAdmin.get('/delete',jwtAuth,adminController.loadDelete)
routerAdmin.post('/addfood',jwtAuth,foodController.addFood)
routerAdmin.get('/search', jwtAuth,adminController.loadSearch)
routerAdmin.get('/trainersearch',jwtAuth, trainerManageController.loadTrainerSearch)
routerAdmin.get('/loadfood', jwtAuth,foodController.loadFood)
routerAdmin.get('/toggleblockfood', jwtAuth,foodController.toggleBlockFood)
routerAdmin.get('/deleteitem', jwtAuth,foodController.deleteItem)
routerAdmin.get('/searchfood',jwtAuth,foodController.foodSearch)
routerAdmin.post('/addplan',jwtAuth,planController.addPlan)
routerAdmin.get('/getplans',jwtAuth, planController.getPlan)
routerAdmin.get('/getplanwithid', jwtAuth,planController.getPlanWithId)
routerAdmin.post('/editplan', jwtAuth,planController.editPlan)
routerAdmin.get('/deleteplan', jwtAuth,
planController.deletPlan)



routerAdmin.get('*',function(req,res){
    res.redirect('/admin')
})

module.exports = routerAdmin


