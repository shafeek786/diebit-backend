const Chat = require('../models/chat')
const User = require('../models/user')
const Trainer = require('../models/trainer')

const date = new Date();

const options = {
  hour: 'numeric',
  minute: 'numeric',
  hour12: true, // Use 12-hour time format with AM/PM
};

const formattedTime = new Intl.DateTimeFormat('en-IN', options).format(date);

//------------------------------------TO CREATE NEW CHAT FROM TRAINER TO USER SIDE----------------
const createNewChat = async (req, res, next) => {
    try {
        const userId = req.params.userId // user id passing as params
        const trainerId = req.params.trainerId // trinainer id take from authmiddleware
        await Chat.create({
            userId:userId,
            trainerId:trainerId,
            text: req.body.text,
            sender: 'trainer',
            time:formattedTime,
        })
        const fetchChatById = await Chat.find({ $and: [{ userId, }, { trainerId }] }).populate('userId')
        return res.status(200).send({ message: 'new chat as been created', success: true,fetchChatById })
    } catch (error) {
        next(error)
    }
}
//--------------------------------TO FETCH CHAT TO SPECIFIC TRAINERS---------------------
const fetchChats = async (req, res, next) => {
    try {
        const userId = req.query.userId // user id passing as params
        const trainerId = req.query.trainerId // trinainer id take from authmiddleware
        const fetchChatById = await Chat.find({ $and: [{ userId, }, { trainerId }] }).populate('userId')
        return res.status(200).send({message:'fetch data by Id success',success:true,fetchChatById});
    } catch (error) {
        next(error)      
    }
}   

const getUnreadMessageCounts = async (userId) => {
    try {
      const unreadCounts = await Chat.aggregate([
        {
          $match: {
            senderType: "Trainer",
            sender: { $ne: userId },
            is_read: false,
          },
        },
        {
          $group: {
            _id: "$sender",
            count: { $sum: 1 },
          },
        },
      ]);
  
      return unreadCounts;
    } catch (error) {
      console.error("Error retrieving unread message counts:", error);
      throw error;
    }
  };
  const getSubscribedTrainer = async (req, res) => {
    try {
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
      trainerData.unreadMessageCount =
        unreadCounts.length > 0 ? unreadCounts[0].count : 0;
  
      res.status(200).json({ message: "got users", trainerData, unreadCounts });
    } catch (err) {
      console.error("Error:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  };

module.exports = {
    createNewChat,
    fetchChats,
    getSubscribedTrainer
}