const trainerWallet = require('../models/trainerWallet')
const Trainer = require('../models/trainer')

const getWalletBallence = async (req,res)=>{
    try{
        const trainerId = req.query.trainerId
        const trainerData = await Trainer.findById(trainerId)
        const walletBalance = trainerData.walletBalance
        console.log(walletBalance)
        res.status(200).json({walletBalance:walletBalance})
       
    }catch{
        console.log(err)
    }
}

const getWalletHistory = async (req,res)=>{
    try{
        const trainerId = req.query.trainerId
        const walletHistory = await trainerWallet.find({trainerId:trainerId})
        console.log(walletHistory)
        res.status(200).json({walletHistory:walletHistory})
       
    }catch{
        console.log(err)
    }
}

module.exports = {
    getWalletBallence,
    getWalletHistory
}