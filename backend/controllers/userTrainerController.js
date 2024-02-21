const Trainer = require("../models/trainer");
const User = require("../models/user");
const Chat = require("../models/chat");
const Chatromm = require('../models/chatRoom')
const trainerWallet = require('../models/trainerWallet')
const subscription = require('../models/SubscriptionPlan')

const gettrianers = async (req, res) => {
  try {
    const trainerData = await Trainer.find();
    console.log(trainerData);
    res.status(200).json({ trainerData: trainerData });
  } catch (err) {
    console.log(err);
  }
};

const gettrainerById = async (req, res) => {
  try {
    const trainerId = req.query.trainerId;
    const trainerData = await Trainer.findById(trainerId);
    console.log(trainerData);
    res.status(200).json({ message: "success", trainerData: trainerData });
  } catch (err) {
    console.log(err);
  }
};



const subscribeTrainer = async (req, res) => {
  try {
    const userId = req.query.userId;
    const trainerId = req.query.trainerId;
    
    // Find the current plan of the user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    console.log("check")

    // Retrieve the price of the current plan
    const currentPlan = user.currentPlan;

    const plan = await subscription.findOne({planType:currentPlan})
    const planPrice = plan.price * 50/100;

    // Update the subscribedTrainer field in the User collection
  
  
   const updated =  await User.findByIdAndUpdate(
      { _id: userId },
      { subscribedTrainer: trainerId }
    );

    const updateBalance = await Trainer.findByIdAndUpdate(
      trainerId,
      { $inc: { walletBalance: planPrice } },
      { new: true }
  );
      console.log("updateBalance :"+ updateBalance)
    // Create a new transaction in the trainer's wallet
    const transaction = new trainerWallet({
      trainerId: trainerId,
      trainerName: user.name, 
      amount: planPrice,
      transactionType: "subscription", 
      date: new Date()
    });
    await transaction.save();

    res.status(200).json({ message: "updated" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getUnreadMessageCounts = async (userId) => {
  try {
    const unreadCounts = await Chat.aggregate([
      {
        $match: {
          senderType: "Trainer",
          sender: { $ne: userId },
          is_read: false,
          receiver: userId, // Add receiver condition to filter by userId
          
        },
      },
      {
        $group: {
          _id: "$sender",
          count: { $sum: 1 },
        },
      },
    ]);
 console.log(unreadCounts)
    return unreadCounts;
  } catch (error) {
    console.error("Error retrieving unread message counts:", error);
    throw error;
  }
};

const getSubscribedTrainer = async (req, res) => {
  try {
    console.log(req.headers)
    const userId = req.query.userId;
    console.log("userId:", userId);

    const userData = await User.findById(userId);
    console.log("userData:", userData);

    if (!userData) {
      return res.status(404).json({ message: "User not found" });
    }

    const trainerId = userData.subscribedTrainer;
    console.log("trainerId:", trainerId);

    if (trainerId === "none") {
      return res
        .status(404)
        .json({ message: "User is not subscribed to any trainer" });
    }

    const trainerData = await Trainer.findById(trainerId);
    console.log("trainerData:", trainerData);

    if (!trainerData) {
      return res.status(404).json({ message: "Trainer not found" });
    }

    const unreadCounts = await getUnreadMessageCounts(userId);
    console.log(unreadCounts);
    const unreadMessageCount = unreadCounts.length > 0 ? unreadCounts[0].count : 0;

    // Update response object to include unreadMessageCount
    const response = {
      message: "got users",
      trainerData: { ...trainerData.toObject(), unreadMessageCount }, // Combine existing trainerData with unreadMessageCount
      unreadCounts
    };
    console.log(response)
    res.status(200).json(response);
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};


const traienrSearch = async (req, res) => {
  try {
    console.log("sss");
    const search = req.query.text;
    console.log(search);
    const trainerData = await Trainer.find({
      role: "Trainer",
      $or: [
         { firstName: { $regex: new RegExp(search, "i") } },
        { lastName: { $regex: new RegExp(search, "i") } },
        { category: { $regex: new RegExp(search, "i") } },
        
      ],
    });
    console.log(trainerData)
    res.status(200).json({ trainerData: trainerData });
  } catch (err) {
    console.log(err);
  }
};

module.exports = {
  gettrianers,
  gettrainerById,
  subscribeTrainer,
  getSubscribedTrainer,
  traienrSearch,
};
