const jwt = require('jsonwebtoken')
const argon2 = require('argon2')
const user = require('../models/user')
const admin = require('../models/admin')
const Trainer = require('../models/trainer')
require('dotenv').config()
const nodeMailer = require('nodemailer')
const Food = require('../models/food')

const verifyLogin = async(req,res) =>{
    try{
        const email = req.body.email
     console.log(email)

        const userData = await admin.findOne({email:email})
        console.log(userData)
        if(userData){
            const passwordMatch = await argon2.verify(userData.password,req.body.password)
            if(passwordMatch){
                console.log('login')
                const response = {
                    id: userData._id,
                    role: userData.role,
                    name: userData.name
                  };
                const accessToken = jwt.sign(response, process.env.ACCESS_TOKEN, {
                    expiresIn: "8h"
                  });
                  
                  res.status(200).json({ message: 'Success',token:accessToken });
            }else{
                res.json({message:'Invalid email ID or password'})
            }
        }

    }catch(err){
        console.log(err)
    }
}

const loadTrainerDashboard  = async(req,res)=>{
    try{

        var search = ''
        if(req.query.search){
            search = req.query.search
        }
      const userData = await Trainer.find({
        role:"Trainer",
        $or:[
            {name:{$regex:'.*'+search+'.*'}},
            {email:{$regex:'.*'+search+'.*'}}
            
        ]
    
    })

    res.status(200).json({userData});
        //res.render('dashboard',{details:userData})
    }catch(error){
        console.log(error.message)
    }
}

const loadSearch = async(req,res)=>{
    try{
        const  searchItem = req.body.value
        console.log(searchItem)
        
        const userData = await user.find({
            role:"user",
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



const loadUserDashboard  = async(req,res)=>{
    try{
    console.log("dash123")
        var search = ''
        if(req.query.search){
            search = req.query.search
        }
      const userData = await user.find({
        role:"user",
        $or:[
            {name:{$regex:'.*'+search+'.*'}},
            {email:{$regex:'.*'+search+'.*'}}
            
        ]
    
    })
    console.log("data:"+userData)
    res.status(200).json({userData});
        //res.render('dashboard',{details:userData})
    }catch(error){
        console.log(error.message)
    }
}


const toggleBlock = async(req,res) =>{
    try {

       
        const userId = req.query.id;
    console.log("userblock")
        const userData = await user.findById(userId);
        if (!userData) {
          return res.status(404).json({ error: 'User not found' });
        }
   
        // Toggle the isBlocked property
        userData.isBlocked = !userData.isBlocked;
        console.log(userData.isBlocked)
        await userData.save();
    
        res.json({ isBlocked: userData.isBlocked });
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
      }
}

const loadDelete = async (req, res) => {
    try {
      console.log("hiii");
      const userId = req.query.id;
      if (!userId) {
        return res.status(400).json({ error: 'Missing user ID parameter' });
      }else{
        const userData = await user.findByIdAndUpdate({isDeleted:true});
        
      }
    
    } catch (error) {
      console.log(error.message);
      res.status(500).json({ error: error.message });
    }
  };

  const toggleBlockTrainer = async(req,res) =>{
   try{
    const userId = req.query.id;
    const userData = await Trainer.findById(userId);
    if (!userData) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Toggle the isBlocked property
    userData.isBlocked = !userData.isBlocked;
    console.log(userData.isBlocked)
    await userData.save();

    res.json({ isBlocked: userData.isBlocked });
   }catch (error) {
      console.log(error.message);
      res.status(500).json({ error: error.message });
    }
}

const trainerStatusChange = async(req,res)=>{
    try{
        const id = req.query.id
        const value = req.query.value
        const userData = await Trainer.findById(id)
        if (!userData) {
            return res.status(404).json({ error: 'User not found' });
          }
          userData.status = value
          await userData.save()
          sentMail(userData.firstName,userData.email,value)
          console.log(userData)
    }catch(err){
        console.log(err)
    }
}

const sentMail = async(name,email,value)=>{
    try{
        const transporter =  nodeMailer.createTransport({
            host:"smtp.gmail.com",
            port: 587,
            secure: false,
            requireTLS: true,
            auth:{
              user: process.env.EMAIL,
              pass:  process.env.PASSWORD
            },
            tls:{
              rejectUnauthorized: false
            }
        })
        const mailOptions ={
            from: process.env.EMAIL,
            to : email,
            cc: process.env.EMAIL,
            subject: 'Confirmation ',
            text: `Hello ${name}, your request to join with us is ${value}`
          }
          transporter.sendMail(mailOptions, function(error, info){
            if(error){
              console.log(error.message)
            }else{
              console.log("email has been sent" + info.response)
            }
            return otp
          })
    }catch(err){
        console.log(err)
    }
}




module.exports = {
    verifyLogin,
    loadTrainerDashboard,
    loadSearch,
    loadUserDashboard,
    toggleBlock,
    loadDelete,
    toggleBlockTrainer,
    trainerStatusChange
    
}
