const mongoose = require('mongoose');

const foodIntakeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId, // Assuming you have a separate user collection
    required: true,
  },
  foodId: {
    type: mongoose.Schema.Types.ObjectId, // Assuming you have a separate food collection
    required: true,
  },
  name:{
    type:String,
    required: true,
  },
  type:{
    type: String,
    default: 'food'
  },
  date: {
    type: Date,
    default: Date.now,
  },
  servingSize: {
    type: Number,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  calories: {
    type: Number,
    required: true,
  },
  protein: {
    type: Number,
    required: true,
  },
  carbohydrates: {
    type: Number,
    required: true,
  },
  fat: {
    type: Number,
    required: true,
  },


 
});

const FoodIntake = mongoose.model('FoodIntake', foodIntakeSchema);

module.exports = FoodIntake;
