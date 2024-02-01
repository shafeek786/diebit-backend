const Workout = require("../models/workout");
const moment = require("moment-timezone");
const addWorkout = async (req, res) => {
  try {
    const userId = req.body.userId;
    console.log(userId);
    const workoutData = req.body.workoutData;
    console.log(workoutData);
    const workoutHistory = new Workout({
      userId: userId,
      name: workoutData.activity,
      effortLevel: workoutData.effortLevel,
      duration: workoutData.duration,
      burnedCalories: workoutData.calories,
    });

    await workoutHistory.save();
    const startDate = moment.tz("Asia/Kolkata").startOf("day");
    const endDate = moment.tz("Asia/Kolkata").endOf("day");
    const todayWorkout = await Workout.find({
      userId: userId,
      date: { $gte: startDate.toDate(), $lte: endDate.toDate() },
    });
    console.log(todayWorkout);

    const totalBurnedCalories = todayWorkout.reduce(
      (burnedCalories, record) => {
        return burnedCalories + record.burnedCalories;
      },
      0
    );
    console.log("burnedCalories : " + totalBurnedCalories);
    res
      .status(200)
      .json({
        burnedCalories: totalBurnedCalories,
        workoutHistory: todayWorkout,
      });
  } catch (err) {
    console.log(err);
  }
};

const getWorkoutHistory = async (req, res) => {

  try {
    const userId = req.query.userId;
    const entryDate = req.query.date;
    console.log(entryDate);
    let startDate, endDate;
    if (entryDate) {
      const momentDate = moment.tz(entryDate, "Asia/Kolkata");
      startDate = momentDate.clone().startOf("day");
      endDate = momentDate.clone().endOf("day");
    } else {
      startDate = moment.tz("Asia/Kolkata").startOf("day");
      endDate = moment.tz("Asia/Kolkata").endOf("day");
    }
    const workoutData = await Workout.find({
      userId,
      date: { $gte: startDate.toDate(), $lte: endDate.toDate() },
    });

    const burnedCalories = workoutData.reduce((burnedCalories, record) => {
      return burnedCalories + record.burnedCalories;
    }, 0);

    console.log(workoutData);
    res
      .status(200)
      .json({ burnedCalories: burnedCalories, workoutHistory: workoutData });
  } catch (err) {
    console.log(err);
  }
};

const remveWorkoutEntry = async (req, res) => {
  try {
    const userId = req.query.userId
    const entryId = req.query.entryId
    const selectedDate = req.query.selectedDate
    const removedWorkout = await Workout.findByIdAndDelete(entryId)

    const momentDate  = moment.tz(selectedDate, "Asia/Kolkata")
    const startDate = momentDate.clone().startOf("day")
    const endDate = momentDate.clone().endOf("day")

    const workoutData = await Workout.find({userId:userId})
    const workoutHistory = workoutData.filter((entry)=>{
      const recordDate = moment.tz(entry.date, "Asia/Kolkata")
      return recordDate.isSameOrAfter(startDate) && recordDate.isSameOrBefore(endDate)
    })

    const burnedCalories = workoutHistory.reduce((burnedCalories,record)=>{
        return burnedCalories + record.burnedCalories
    },0)

    res.status(200).json({burnedCalories:burnedCalories,workoutHistory:workoutHistory})
  } catch (err) {
    console.log(err);
  }
};
module.exports = {
  addWorkout,
  getWorkoutHistory,
  remveWorkoutEntry,
};
