const mongoose = require('mongoose');

const TimeSchedullerSchema = new mongoose.Schema({
    trainerId: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    timeSlot: {
        type: String, // Assuming time is represented as string (e.g., "10:00 AM")
        required: true
    },
    status:{
        type: String,
        default: 'Available'
    }
});

module.exports = mongoose.model('TimeScheduller', TimeSchedullerSchema);
