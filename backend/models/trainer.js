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
    password:{
        type: String
    },
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
    height:{
        type:Number
    },
    weight:{
        type: Number
    },
    userName:{
        type:String
    },
    proPic:{
        type: String
    },
    plan:{
        type:String,
        default:'None'
    },
    weightHistory:[
        {
            date:{
                type: Date
            },
            weight:{
                type: Number
            }
        }
    ],
    isBlocked:{
        type:Boolean,
        default:false
    },
    hasFilledProfile: {
        type: Boolean,
        default: false
    },
    status:{
        type:String,
        default:"Pending"
    }
})


module.exports = mongoose.model('trainer', trainerSchema)