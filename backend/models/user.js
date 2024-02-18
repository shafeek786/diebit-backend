const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    mobile: { type: Number, required: true },
    password: { type: String, required: true },
    role: { type: String, required: true, default: 'user' },
    isBlocked: { type: Boolean, default: false },
    hasFilledProfile: { type: Boolean, default: false },
    dateOfBirth: { type: Date },
    gender: { type: String },
    height: { type: Number },
    weight: { type: Number },
    isOnline:{type:String,default:'0'},
    plan: { type: String },
    isDeleted: {
        type: Boolean,
        default: false
    },
    isSubscribed: { type: Boolean, default: false },
    currentPlan:{type:String},
    subscribedTrainer:{type:String,default:'none'},

    weightHistory: [{
        id: { type: mongoose.Schema.Types.ObjectId, ref: 'WeightEntry' },
        name: { type: String, required: true, default: 'Weight' },
        type: { type: String, default: 'weight' },
        date: { type: Date },
        weight: { type: Number },
        unit: { type: String }
    }],
    subscription: [{
        planId: { type: mongoose.Schema.Types.ObjectId, ref: 'Plan' }, 
        planName: { type: String }, // Corrected spelling from 'planeName' to 'planName'
        startDate: { type: Date },
        endDate: { type: Date },
       
    }],
    lastMessageTimestamp: { type: Date }
    
},
 {timestamps:true}   
);

const User = mongoose.model('User', userSchema);

module.exports = User;
