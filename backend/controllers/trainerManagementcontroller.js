const jwt = require('jsonwebtoken')
const argon2 = require('argon2')
const Trainer = require('../models/trainer')
require('dotenv').config()
const nodeMailer = require('nodemailer')
const Food = require('../models/food')

const loadTrainerSearch = async(req,res)=>{
    try{
        const  searchItem = req.query.value
        console.log(searchItem)
        
        const userData = await Trainer.find({
            role:"Trainer",
        $or:[
            {name:{$regex:'.*'+searchItem+'.*'}},
            {email:{$regex:'.*'+searchItem+'.*'}}
            
        ]
         })
      console.log(userData)
        res.status(200).json({ userData });
    }catch(error){
        console.log(error.message)
    }
  }


  module.exports = {
    loadTrainerSearch
  }