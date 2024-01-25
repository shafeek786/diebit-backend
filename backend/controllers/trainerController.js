const jwt = require('jsonwebtoken')
const argon2 = require('argon2')
const Trainer = require('../models/trainer')
require('dotenv').config()

const verifyLogin = async(req,res) => {
    try{
        const email = req.body.email
        console.log(email)
   
           const userData = await Trainer.findOne({email:email})
           console.log(userData)
        if(userData){
            const passwordMatch = await argon2.verify(userData.password,req.body.password)
            if(passwordMatch){
                if(userData.status === 'Pending'){
                    res.status(200).json({ message: 'Please wait for the approvel'});
                }
               else if(userData.status === 'Rejected' && userData.isBlocked){
                    res.status(200).json({ message: 'You are blocked, Please contact admin'});
                }
                else{
                    console.log('login')
                    const response = {
                        id: userData._id,
                        role: userData.role,
                        name: userData.firstName
                      };
                    const accessToken = jwt.sign(response, process.env.ACCESS_TOKEN, {
                        expiresIn: "8h"
                      });
                      
                      res.status(200).json({ message: 'Success',token:accessToken });
                }
            }else{
                res.json({message:'Invalid email ID or password'})
            }
        }
    }catch(err){
       console.log(err)

    }
}

const signUp = async(req,res)=>{
    try{
        const existUser = await Trainer.findOne({ email: req.body.email });
        const userData1 = await Trainer.findOne({ mobile: req.body.mobile });
        const email =req.body.email.toLowerCase()
        console.log(email)
        // Initialize userDataMap as an empty object if it doesn't exist
    
    
        if (existUser == null && userData1 == null){
            console.log(req.body.mobileNumber)
            const password = await argon2.hash(req.body.password)
            const trainer = new Trainer({
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                email: email,
                mobile: req.body.mobileNumber,
                qualification: req.body.qualification,
                yearofexperience: req.body.yearofexperience,
                password:password

            })
            const saveTrainer = await trainer.save()
            if(saveTrainer){
                console.log("trainer")
                res.status(200).json({ message: 'success', userStatus: 'new user' });
            }
        }else if (existUser) {
            res.status(200).json({ message: 'Email ID already exists' });
          } else if (userData1) {
            res.status(200).json({ message: 'Mobile number already exists' });
          }
    }catch(err){
        console.log(err)
    }

}
module.exports = {
    verifyLogin,
    signUp
}