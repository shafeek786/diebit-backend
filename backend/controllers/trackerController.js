const User = require("../models/user");
const Food = require("../models/food");
const FoodIntake = require("../models/foodIntake");
const moment = require("moment-timezone");
const { ObjectId } = require('mongoose').Types;


const getUser = async (req, res) => {
  try {
    const id = req.query.id;
    const userData = await User.findById({ _id: id });
    if (userData) {
      res.status(200).json({ userData });
    }
  } catch (res) {
    console.log(err);
  }
};

const getUserFoodHistory = async (req, res) => {
  try {
    const userId = req.query.id;
    const date = req.query.date;
    console.log("Received date from client:", date);

    let startDate, endDate;

    if (date) {
      const momentDate = moment.tz(date, "Asia/Kolkata");
      startDate = momentDate.clone().startOf("day");
      endDate = momentDate.clone().endOf("day");
    } else {
      startDate = moment.tz("Asia/Kolkata").startOf("day");
      endDate = moment.tz("Asia/Kolkata").endOf("day");
    }

    console.log(
      "in: " + startDate.toISOString() + " out: " + endDate.toISOString()
    );

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
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const weightHistoryTracker = async (req, res) => {
  try {
    const userId = req.query.id;
    const date = req.query.date;

    let startDate, endDate;

    if (date) {
      const momentDate = moment.tz(date, "Asia/Kolkata");
      startDate = momentDate.clone().startOf("day");
      endDate = momentDate.clone().endOf("day");
    } else {
      startDate = moment.tz("Asia/Kolkata").startOf("day");
      endDate = moment.tz("Asia/Kolkata").endOf("day");
    }

    console.log(
      "in: " + startDate.toISOString() + " out: " + endDate.toISOString()
    );

    const userData = await User.findById({ _id: userId });
    const weightHistory = userData.weightHistory;

    // Filter weight history based on the provided date or today's date
    const filteredWeightHistory = weightHistory.filter((record) => {
      const recordDate = moment.tz(record.date, "Asia/Kolkata");
      return (
        recordDate.isSameOrAfter(startDate) &&
        recordDate.isSameOrBefore(endDate)
      );
    });

    console.log(filteredWeightHistory);
    res.json({ todayWeightHistory: filteredWeightHistory });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const removeWeightEntry = async (req, res) => {
  try {
    console.log("hiii");
    const userId = req.query.userId;
    const entryId = req.query.entryId;
    const selecteDate = req.query.selectedDate;
  
    const user = await User.findById({ _id: userId });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    user.weightHistory.forEach((entry) => {
      entry._id = new ObjectId(entry._id);
    });

    const entryIndex = user.weightHistory.findIndex((entry) => entry._id.toString() === entryId);

    console.log("entry index:" + entryIndex);

    if (entryIndex === -1) {
      return res.status(404).json({ error: "Weight entry not found" });
    }

    // Remove the entry at the found index
    user.weightHistory.splice(entryIndex, 1);

    // Save the user with the modified weightHistory
    await user.save();

    const momentDate = moment.tz(selecteDate, "Asia/Kolkata");
    const startDate = momentDate.clone().startOf("day");
    const endDate = momentDate.clone().endOf("day");

    const userData = await User.findById(userId);

    if (!userData) {
      return res.status(404).json({ error: "User not found" });
    }

    const weightHistory = userData.weightHistory;
    const filteredWeightHistory = weightHistory.filter((record) => {
      const recordDate = moment.tz(record.date, "Asia/Kolkata");
      return recordDate.isSameOrAfter(startDate) && recordDate.isSameOrBefore(endDate);
    });
console.log(filteredWeightHistory)
    return res.status(200).json({
      message: "Weight entry removed successfully",
      todayWeightHistory: filteredWeightHistory,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};



module.exports = {
  getUser,
  getUserFoodHistory,
  weightHistoryTracker,
  removeWeightEntry,
};
