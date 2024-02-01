const mongoose = require('mongoose');

const subscriptionPlanSchema = new mongoose.Schema({
  planType: { type: String, required: true },
  price: { type: Number, required: true },
  blog:{type: Boolean, default:false},
  chat:{type: Boolean, default:false},
  trainer:{type: Boolean, default:false},
  progressTracking:{type: Boolean, default:false},
  workoutPlan:{type: Boolean, default:false},
  videoCall:{type: Boolean, default:false},


 
});

const SubscriptionPlan = mongoose.model('SubscriptionPlan', subscriptionPlanSchema);

module.exports = SubscriptionPlan;
