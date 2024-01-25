const mongoose = require('mongoose')

const adminSchema = new mongoose.Schema({
    name:{
        type:String
    },
    email:{
        type:String
    },
    role:{
        type: String,
        default: 'Admin'
    },
    password:{
        type:String
    }

})

module.exports = mongoose.model('admin', adminSchema)
