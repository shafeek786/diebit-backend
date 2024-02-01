const express = require('express');
const routerAdmin = express.Router()
const adminController = require('../controllers/adminController');
const router = require('./userRoute');
const trainerManageController = require('../controllers/trainerManagementcontroller')
const foodController = require('../controllers/foodController')
const planController = require('../controllers/planController')
routerAdmin.use(express.urlencoded({extended:true}))
routerAdmin.use(express.json())





routerAdmin.post('/verifylogin',adminController.verifyLogin)
routerAdmin.get('/trainerdashboard', adminController.loadTrainerDashboard)
routerAdmin.get('/userdashboard', adminController.loadUserDashboard)
routerAdmin.post('/search',adminController.loadSearch)
routerAdmin.get('/toggleBlock',adminController.toggleBlock)
routerAdmin.get('/toggleBlockTrainer', adminController.toggleBlockTrainer)
routerAdmin.get('/trainerStatusChange', adminController.trainerStatusChange)
routerAdmin.get('/delete',adminController.loadDelete)
routerAdmin.post('/addfood',foodController.addFood)
routerAdmin.get('/search', adminController.loadSearch)
routerAdmin.get('/trainersearch', trainerManageController.loadTrainerSearch)
routerAdmin.get('/loadfood', foodController.loadFood)
routerAdmin.get('/toggleblockfood', foodController.toggleBlockFood)
routerAdmin.get('/deleteitem', foodController.deleteItem)
routerAdmin.get('/searchfood',foodController.foodSearch)
routerAdmin.post('/addplan',planController.addPlan)
routerAdmin.get('/getplans', planController.getPlan)
routerAdmin.get('/getplanwithid', planController.getPlanWithId)
routerAdmin.post('/editplan', planController.editPlan)



routerAdmin.get('*',function(req,res){
    res.redirect('/admin')
})

module.exports = routerAdmin


