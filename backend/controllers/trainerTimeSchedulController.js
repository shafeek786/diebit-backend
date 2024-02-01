
const timeScheduler = require('../models/timeScheduler');
const TimeScheduller = require('../models/timeScheduler');

const addTime = async (req, res) => {
    try {
        const { trainerId, date, timeSlot } = req.body;

        const newTimeScheduller = new TimeScheduller({
            trainerId: trainerId,
            date: date,
            timeSlot: timeSlot
        });

       await newTimeScheduller.save();
        const slotData = await TimeScheduller.find({trainerId:trainerId})
        
        console.log(slotData)
        res.status(201).json({ message: 'Time slot added successfully', timeSlot:slotData });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to add time slot' });
    }
};

const getSlot  = async(req,res)=>{
    try{
        const trainerId = req.query.trainerId
        const slotData = await TimeScheduller.find({trainerId:trainerId})
        
        console.log(slotData)
        res.status(201).json({ message: 'Time slot added successfully', timeSlot:slotData })
    }catch(err){
        console.log(err)
    }
}

const cancelSlot = async (req,res)=>{
    try{
        const slotId = req.query.slotId
        const trainerId  =req.query.trainerId
        const updatedData = await TimeScheduller.findByIdAndUpdate({_id:slotId},{
            status : 'Cancelled'
        })
        const slotData = await timeScheduler.find({trainerId:trainerId})
        res.status(201).json({ message: 'Time slot added successfully', timeSlot:slotData })
    }catch(err){
        console.log(err)
    }
  }

module.exports = {
    addTime,
    getSlot,
    cancelSlot
};
