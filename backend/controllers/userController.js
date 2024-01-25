
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require('../models/user')
const nodeMailer = require('nodemailer')
require('dotenv').config()
const argon2 = require('argon2')
const user = require('../models/user')
const { use } = require('../routes/userRoute')

let userDataMap1 = {}


const securePassword = async (password) => {
    try {
      const passwordHash = await bcrypt.hash(password, 10);
      return passwordHash;
    } catch (error) {
      console.log(error.message);
    }
  };
const loadIndex=  async(req,res)=>{
    try{
        console.log("hiii")
        res.json({ success: true })
    }catch(err){
        console.log(err)
    }
}

const generateOtp = async(email)=>{
  const otp = Math.floor(1000 + Math.random() * 9000).toString();
  console.log(email)
  const otpData = {
    email:email,
    otp:otp,
    creationTime: Date.now()
  }
return otpData
}

const sendMail = async(name,email,otp) => {
    try{
      //const otp = await generateOtp(email)
      console.log(otp)
    
      const transporter = nodeMailer.createTransport({
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
        subject: 'OTP Verification',
        text: `Hello ${name}, your otp is ${otp}`
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
const postSignup = async (req, res) => {
  try {
    const existUser = await User.findOne({ email: req.body.email });
    const userData1 = await User.findOne({ mobile: req.body.mobileNumber });
    const email =req.body.email.toLowerCase()
    console.log(email)
    // Initialize userDataMap as an empty object if it doesn't exist


    if (existUser == null && userData1 == null) {
      // Create instance-specific variables
      
      const otpData = await generateOtp(email);

      // Store data in an object specific to this user
      const userData = {
        name: req.body.name,
        email: email,
        mobile: req.body.mobileNumber,
        password: req.body.password,
        otp: otpData.otp,
        creationTime: otpData.creationTime
      };

      // Store user data in the userDataMap with email as the key
      userDataMap1[req.body.email] = userData;

      // Send OTP
      sendMail(userData.name, userData.email, userData.otp);

      res.status(200).json({message:"otp has been sent, Please verify otp"});
    } else if (existUser) {
      res.status(200).json({ message: 'Email ID already exists' });
    } else if (userData1) {
      res.status(200).json({ message: 'Mobile number already exists' });
    }
  } catch (err) {
    console.log(err);
  }
};
/*const postSignup = async(req,res)=>{
    try{
     
        const existUser = await User.findOne({ email: req.body.email })
       const userData1 = await User.findOne({mobile:req.body.mobileNumber})
      if(existUser == null && userData1 == null){
        userRegData = req.body
        sendMail(userRegData.name,userRegData.email)
        res.status(200).json({message:"otp has been sent, Please verify otp"})
      }
      else if(existUser){
        res.status(200).json({message:"Email ID already exist"})
      }
      else if(userData1){
        res.status(200).json({message:"Mobile number already exist"})
      }
    }catch(err){
        console.log(err)
    }
} 

const verifyOTP = async(req,res) =>{
  try{
    const { email, otp } = req.body;
    const userData = userDataMap[email];
   
    if (userData && userData.otp === otp) {
 
      if (await User.findOne({ email })){
        console.log(email)
        res.status(200).json({message:'success',userStatus:'existing user'})
      }else{
        console.log("hiii")
        const password = await argon2.hash(userRegData.password)
        const user = new User({
          name: userRegData.name,
          email: userRegData.email,
          mobile: userRegData.mobileNumber,
          password: password
        })
        const userData = await user.save()
        res.status(200).json({message:'success',userStatus:'new user'})
      }
     
    }else{
      res.status(200).json({message:'invalid OTP'})
    }
  }catch(err){
    console.log(err)
  }
}
*/

const verifyOTP = async (req, res) => {
  try {
    console.log("otp");
    const { email, otp } = req.body;
    
    // Get user data from the userDataMap based on the email
    const userData = userDataMap1[email];
    console.log(userData);

    if (userData) {
      console.log("otp1");
      const currentTime = Date.now();
      const otpCreationTime = userData.creationTime;
      const timeDifference = (currentTime - otpCreationTime) / 1000; // Convert to seconds

      // Check if OTP has expired (3 minutes = 180 seconds)
      if (timeDifference <= 180) {
        console.log("otp2");
        if (userData.otp === otp) {
          // Check if the email already exists in the database
          const existingUser = await User.findOne({ email });

          if (existingUser) {
            console.log(email);
            res.status(200).json({ message: 'success', userStatus: 'existing user' });
          } else {
            console.log('hiii');
            const password = await argon2.hash(userData.password); // Use password from userData
            const user = new User({
              name: userData.name,
              email: userData.email,
              mobile: userData.mobile,
              password: password,
            });
            const savedUser = await user.save();
            res.status(200).json({ message: 'success', userStatus: 'new user' });
          }
        } else {
          res.status(200).json({ message: 'invalid OTP' });
        }
      } else {
        res.status(200).json({ message: 'OTP has expired' });
      }
    } else {
      res.status(200).json({ message: 'Invalid email' });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};





const verifyLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const userData = await user.findOne({ email });

    if (userData && userData.isDeleted === false) {
      var passwordMatch = await argon2.verify(userData.password, password);

      if (passwordMatch) {
        if (userData.isBlocked === true) {
          res.status(401).json({ message: 'You are blocked' });
        } else {
          console.log(userData.role)
          const response = {
            id: userData._id,
            role: userData.role,
            name: userData.name,
            mobile: userData.mobile,
            email: userData.email,
            hasFilledProfile: userData.hasFilledProfile // add this line
          };
          
          const accessToken = jwt.sign(response, process.env.ACCESS_TOKEN, {
            expiresIn: "8h"
          });
          
          res.status(200).json({ message: 'Success',token:accessToken });
        }
      } else {
        res.status(401).json({ message: 'Invalid email ID or password' });
      }
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const forgotPassword = async (req, res) => {
  try {
    const userData = await User.findOne({ email: req.body.email });
    const email = req.body.email;
    const otpData = await generateOtp(email);
    console.log(otpData);

    if (userData) {
      const userData1 = {
        name: userData.name,
        email: userData.email,
        otp: otpData.otp,
        creationTime: otpData.creationTime,
        count:3
      };
      console.log(userData1);
      userDataMap1[req.body.email] = userData1;
      sendMail(userData.name, userData.email, otpData.otp);
      res.status(200).json({ message: "otp has been sent, Please verify otp" });
    } else if (!userData) {
      res.status(200).json({ message: "Email ID is invalid" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const resendOtp = async(req,res) =>{
  try{

    const email = req.body.email
    const userData =userDataMap1[email]
  if(userData.count >0){
    
    console.log(userData.count)
    
    const otpData = await generateOtp(email)
    userDataMap1[email] = {otp:otpData.otp,creationTime:otpData.creationTime,count:userData.count--}
    
    sendMail(userData.name, userData.email, otpData.otp);
    res.status(200).json({ message: "otp has been resent, Please verify otp" });
  }else{
    res.status(200).json({message:"Tried maximum"})
  }

  }catch(err){
    console.log(err)
  }

}

const resetPassword = async(req,res)=>{
  try{
    const email = req.body.email
    const securePassword = await argon2.hash(req.body.password)
    const userData = await User.findOneAndUpdate({email:email},{$set:{password:securePassword}})
    console.log("rest")
    res.status(200).json({message:"password has been reset"})

  }catch(err){
    console.log(err)
  }
}

const updateProfile = async(req,res)=>{
  try{
    const id = req.body.id
    const userData = await User.findByIdAndUpdate({_id:id},{
      gender:req.body.userData.gender,
      dateOfBirth:req.body.userData.dob,
      height:req.body.userData.height,
      weight:req.body.userData.weight,
      hasFilledProfile: true
    })
    await User.findByIdAndUpdate({_id:id}, {
      $push: {
        weightHistory: {
          date: new Date(),
          weight: req.body.userData.weight,
          unit:'kg'
        }
      }
    });
    if(userData){
      res.json({message:'success'})
    }
  }catch(err){
    console.log(err)
  }
      
  }

  const checkFilled = async (req, res) => {
    try{
      const id = req.query.id;
      const userData = await user.findById({ _id: id });
     
      if (!userData) {
        return res.status(404).json({ error: "User not found" });
      }
  
      // Assuming hasFilledProfile is a boolean field in the user schema
      const hasFilledProfile = userData.hasFilledProfile;
      // Send a response indicating whether the user has filled the profile or not
      res.json({ hasFilledProfile });
    }catch(err){
      console.log(err);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };
  
  const isBlocked = async(req,res) =>{
    try{
      const id = req.query.id;
      const userData = await user.findById({ _id: id });
     
      if (!userData) {
        return res.status(404).json({ error: "User not found" });
      }
  
      // Assuming hasFilledProfile is a boolean field in the user schema
      const isBlocked = userData.isBlocked;
      console.log(isBlocked)
      // Send a response indicating whether the user has filled the profile or not
      res.json({ isBlocked });
    }catch(err){
      console.log(err)
    }
  }
const updateWeight = async(req,res)=>{
  try{
    const {id,weight}=  req.body

    const userData = await user.findById({_id:id})

    if(!userData){
      return res.status(404).json({ error: "User not found" });
    }
    await user.findByIdAndUpdate(id, { $set: { weight:weight.weight } });
    await user.findByIdAndUpdate(id, {
      $push: {
        weightHistory: {
          date: new Date(),
          weight: weight.weight,
          unit: weight.unit
        }
      }
    });
    
    const today = new Date()
    today.setUTCHours(0,0,0,0)
    const user1 =await User.findById({_id:id})
    const todayWeightRecord = user1.weightHistory.filter(record=>{
      const recordDate = new Date(record.date)
      console.log(recordDate)
      recordDate.setUTCHours(0, 0, 0, 0);
      return recordDate.getTime() === today.getTime();
    })
  const userD = await user.findById({_id:id})
    res.json({todayWeightRecord:todayWeightRecord,userData:userD})
  }catch(err){
    console.log(err)
  }
}

const getWeightHistory = async(req,res)=>{
  try{
    const userId = req.query.id
    const tenWeeksAgo = new Date()
    tenWeeksAgo.setDate(tenWeeksAgo.getDate() - 7*10)
    const userData = await user.findById({_id:userId})
    if(!userData){
      return res.json({message:"user not found"})
    }

    const weightHistory = userData.weightHistory.filter(entry =>{
      return entry.date >= tenWeeksAgo
    })

    res.status(200).json({ weightHistory: weightHistory });

  }catch(err){
    console.log(err)
  }
}
module.exports = {
    loadIndex,
    postSignup,
    verifyOTP,
    verifyLogin,
    forgotPassword,
    resetPassword,
    resendOtp,
    updateProfile,
    checkFilled,
    isBlocked,
    updateWeight,
    getWeightHistory
}