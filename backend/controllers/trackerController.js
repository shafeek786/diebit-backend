const User = require('../models/user')
const Food = require('../models/food')
const FoodIntake = require('../models/foodIntake')
const moment = require('moment-timezone');

const getUser = async(req,res)=>{
    try{
        const id = req.query.id
        const userData = await User.findById({_id:id})
        if(userData){
           
            res.status(200).json({userData});
        }
    }catch(res){
        console.log(err)
    }
}

const getUserFoodHistory = async (req, res) => {
  try {
    const userId = req.query.id;
    const date = req.query.date;
    console.log("Received date from client:", date);

    let startDate, endDate;

    if (date) {
      const momentDate = moment.tz(date, 'Asia/Kolkata');
      startDate = momentDate.clone().startOf('day');
      endDate = momentDate.clone().endOf('day');
    } else {
      startDate = moment.tz('Asia/Kolkata').startOf('day');
      endDate = moment.tz('Asia/Kolkata').endOf('day');
    }

    console.log("in: " + startDate.toISOString() + " out: " + endDate.toISOString());

    const foodHistory = await FoodIntake.find({
      userId,
      date: { $gte: startDate.toDate(), $lte: endDate.toDate() },
    });

    console.log(foodHistory);

    const todayCalorieIntake = foodHistory.reduce((totalCalories, record) => {
      const caloriesWithQuantity = record.calories * record.quantity;
      return totalCalories + caloriesWithQuantity;
    }, 0);

    res.json({ todayCalorieIntake, foodHistory });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};














const weightHistoryTracker = async (req, res) => {
  try {
    const userId = req.query.id;
    const date = req.query.date;

    let startDate, endDate;

    if (date) {
      const momentDate = moment.tz(date, 'Asia/Kolkata');
      startDate = momentDate.clone().startOf('day');
      endDate = momentDate.clone().endOf('day');
    } else {
      startDate = moment.tz('Asia/Kolkata').startOf('day');
      endDate = moment.tz('Asia/Kolkata').endOf('day');
    }

    console.log("in: " + startDate.toISOString() + " out: " + endDate.toISOString());

    const userData = await User.findById({ _id: userId });
    const weightHistory = userData.weightHistory;

    // Filter weight history based on the provided date or today's date
    const filteredWeightHistory = weightHistory.filter(record => {
      const recordDate = moment.tz(record.date, 'Asia/Kolkata');
      return recordDate.isSameOrAfter(startDate) && recordDate.isSameOrBefore(endDate);
    });

    console.log(filteredWeightHistory);
    res.json({ todayWeightHistory: filteredWeightHistory });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

  

  

module.exports = {
    getUser,
    getUserFoodHistory,
    weightHistoryTracker
}