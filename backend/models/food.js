// food.model.js
const mongoose = require('mongoose');

const foodSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  energy: {
    type: Number,
    required: true
  },
  carbohydrate: {
    type: Number,
    required: true
  },
  fiber: {
    type: Number,
    required: true
  },
  sugar: {
    type: Number,
    required: true
  },
  protein: {
    type: Number,
    required: true
  },
  fat: {
    type: Number,
    required: true
  },
  vitamins: {
    a: { type: Number, default: 0 },
    b1: { type: Number, default: 0 },
    b2: { type: Number, default: 0 },
    b3: { type: Number, default: 0 },
    b5: { type: Number, default: 0 },
    b6: { type: Number, default: 0 },
    b9: { type: Number, default: 0 },
    b12: { type: Number, default: 0 },
    c: { type: Number, default: 0 },
    d: { type: Number, default: 0 },
    e: { type: Number, default: 0 },
    biotin: { type: Number, default: 0 },
    // Add other vitamin fields here
  },
  minerals: {
    calcium: { type: Number, default: 0 },
    iron: { type: Number, default: 0 },
    zinc: { type: Number, default: 0 },
    magnesium: { type: Number, default: 0 },
    copper: { type: Number, default: 0 },
    chromium: { type: Number, default: 0 },
    potassium: { type: Number, default: 0 },
    // Add other mineral fields here
  },
  isBlocked:{
    type:Boolean,
    default:false
  }
});

const Food = mongoose.model('Food', foodSchema);

module.exports = Food;
