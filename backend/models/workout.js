const mongoose = require('mongoose');

const WorkoutSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    type:{
        type:String,
        default:'workout'
    },
    effortLevel:{
        type: String,
        required: true
    },
    duration: {
        type: Number,
        required: true,
    },
    burnedCalories: {
        type: Number,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now,
    }
});

const Workout = mongoose.model('Workout', WorkoutSchema);

module.exports = Workout;
