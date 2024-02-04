const Trianer = require('../models/trainer')

const gettrianers = async(req,res)=>{
    try{
        const trainerData = await Trianer.find()
        console.log(trainerData)
        res.status(200).json({trainerData:trainerData})
    }catch(err){
        console.log(err)
    }
}

const gettrainerById = async(req,res)=>{
    try{
        const trainerId = req.query.trainerId
        const trainerData = await Trianer.findById(trainerId)
        console.log(trainerData)
        res.status(200).json({message:"success", trainerData:trainerData})
    }catch(err){
        console.log(err)
    }
}
module.exports = {
    gettrianers,
    gettrainerById
}