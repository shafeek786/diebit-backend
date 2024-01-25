const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    mobile: { type: Number, required: true },
    password: { type: String, required: true },
    role: { type: String, required: true,default:'user' },
    isBlocked: { type: Boolean, default: false },
    hasFilledProfile: { type: Boolean, default: false },
    dateOfBirth: { type: Date},
    gender: { type: String },
    height: { type: Number },
    weight: { type: Number },
    plan: { type: String },
    isDeleted:{
        type:Boolean,
        default:false
    },
    weightHistory: [{
        name: { type: String, required: true,default:'Weight' },
        type: { type: String,default:'weight' },
        date: { type: Date},
        weight: { type: Number},
        unit: { type: String}
    }]
});

const User = mongoose.model('User', userSchema);

module.exports = User;
