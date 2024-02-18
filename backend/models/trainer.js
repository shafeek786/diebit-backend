const mongoose = require('mongoose')


const trainerSchema = new mongoose.Schema({
    firstName:{
        type:String
    },
    lastName:{
        type:String
    },
    email:{
        type:String,
        unique:true
    },
    mobile:{
        type:Number,
        unique:true
    },
    qualification:{
        type:String
    },
    yearofexperience:{
        type:Number
    },
    walletBalance:{
        type:Number,
        default:0
    },
    password:{
        type: String
    },
    category:{
        type:String,
        required:true
    },
    certificate:[{
        type:String,
        required: true
    }],
    role:{
        type:String,
        default:'Trainer'
    },
    gender:{
        type:String
    },
    dateOfBirth:{
        type:Date
    },
    userName:{
        type:String
    },
    proPic:[{
        type: String
    }],
  
    isBlocked:{
        type:Boolean,
        default:false
    },
    status:{
        type:String,
        default:"Pending"
    },
    aboutMe:{
        type:String
    }
})


module.exports = mongoose.model('trainer', trainerSchema)