const mongoose =require('mongoose')
const { schema } = require('./user')

const trainerWalletSchema = new mongoose.Schema({
    trainerId:{
        type:String,
        required:true
    },
    trainerName:{
        type:String,
        required:true
    },
    amount:{
        type:Number,
        required:true
    },
    transactionType:{
        type:String,
        required:true
    },
    date:{
        type:Date,
        required:true
    }
})
module.exports = mongoose.model('trainerWallet', trainerWalletSchema)
