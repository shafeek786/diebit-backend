const jwt = require("jsonwebtoken");
const argon2 = require("argon2");
const Trainer = require("../models/trainer");
const User = require("../models/user");
const path = require("path");
const cloudinary = require('cloudinary').v2;
const Chat = require("../models/chat");
const { Console } = require("console");

require("dotenv").config();

const verifyLogin = async (req, res) => {
  try {
    const email = req.body.email;

    const userData = await Trainer.findOne({ email: email });
    if (userData) {
      const passwordMatch = await argon2.verify(
        userData.password,
        req.body.password
      );
      if (passwordMatch) {
        if (userData.status === "Pending") {
          res.status(200).json({ message: "Please wait for the approvel" });
        } else if (userData.status === "Rejected" && userData.isBlocked) {
          res
            .status(200)
            .json({ message: "You are blocked, Please contact admin" });
        } else {
          const response = {
            id: userData._id,
            role: userData.role,
            name: userData.firstName,
          };
          const accessToken = jwt.sign(response, process.env.ACCESS_TOKEN, {
            expiresIn: "8h",
          });

          res.status(200).json({ message: "Success", token: accessToken });
        }
      } else {
        res.json({ message: "Invalid email ID or password" });
      }
    }
  } catch (err) {
    console.log(err);
  }
};

const signUp = async (req, res) => {
  try {
    const data = JSON.parse(req.body.data)

    const images = req.files.image;
    const email = data.email.toLowerCase();
    const existUser = await Trainer.findOne({ email: email });
    const userData1 = await Trainer.findOne({ mobile: data.mobileNumber });
    console.log(data)
let imagesPath = [];
for (const image of images) {
  try {
    const result = await cloudinary.uploader.upload(image.path, {
      folder: 'cerificates',
      width:250,
      height: 300,
      crop:'fill'

    });
    imagesPath.push(result.secure_url);
  } catch (uploadError) {
    if (uploadError.http_code === 400 && uploadError.message.includes('File size too large. Got 15002367. Maximum is 10485760.')) {
      return res.status(200).json({ message: 'File size too large. Maximum is 10MB.' });
    } else {
      throw uploadError;
    }
  }
}
    if (existUser == null && userData1 == null) {
      const password = await argon2.hash(data.password);
      const trainer = new Trainer({
        firstName: data.firstName,
        lastName: data.lastName,
        email: email,
        mobile: data.mobileNumber,
        qualification: data.qualification,
        yearofexperience: data.yearofexperience,
        category: data.profession,
        certificate:imagesPath,
        password: password,
      });
      const saveTrainer = await trainer.save();
      if (saveTrainer) {
        console.log("trainer");
        res.status(200).json({ message: "success", userStatus: "new user" });
      }
    } else if (existUser) {
      res.status(200).json({ message: "Email ID already exists" });
    } else if (userData1) {
      res.status(200).json({ message: "Mobile number already exists" });
    }
  } catch (err) {
    console.log(err);
  }
};

const getTrainer = async (req, res) => {
  try {
    const trianerId = req.query.trainerId;

    const trainerData = await Trainer.findById(trianerId);
    res.status(200).json({ trainerData: trainerData });
  } catch (err) {
    console.log(err);
  }
};

const updateTrainer = async (req, res) => {
  try {
    const trainerId = req.body.trainerId;
    const data = req.body.data;

    const updatedData = await Trainer.findByIdAndUpdate(
      { _id: trainerId },
      {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        mobile: data.mobile,
        qualification: data.qualification,
        yearofexperience: data.yearofexperience,
        aboutMe:data.aboutMe
      }
    );
    const trainerData = await Trainer.findById(trainerId);
    res.status(200).json({ message: "updated", trainerData: trainerData });
  } catch (err) {
    console.log(err);
  }
};

const profilePicUpload = async (req, res) => {
  try {
    const trainerId = req.query.trainerId;
    const images = req.files.image;
    let imagesPath = [];
    for (const image of images) {
      try {
        const result = await cloudinary.uploader.upload(image.path, {
          folder: 'profile_pics',
          width:250,
          height: 350,
          crop:'fill'

        });
        imagesPath.push(result.secure_url);
      } catch (uploadError) {
        if (uploadError.http_code === 400 && uploadError.message.includes('File size too large. Got 15002367. Maximum is 10485760.')) {
          return res.status(200).json({ message: 'File size too large. Maximum is 10MB.' });
        } else {
          throw uploadError; // Re-throw the error if it's not related to file size
        }
      }
    }
    await Trainer.findByIdAndUpdate(
      { _id: trainerId },
      {
        $set: {
          proPic: imagesPath,
        },
      }
    );
    const trainerData = await Trainer.findById(trainerId)
    res.status(200).json({message:'updated', trainerData:trainerData})
  } catch (err) {
    console.log(err);
  }
};


const getUsers = async (req, res) => {
    try {
        const trainerId = req.query.trainerId;

        const userList = await User.find({ subscribedTrainer: trainerId });

        
        const unreadCounts = await getUnreadMessageCounts(trainerId);

      
        const userListWithUnreadCounts = userList.map(user => {
            const unreadCount = unreadCounts.find(count => count._id.equals(user._id));
            return {
                ...user.toObject(), 
                unreadMessageCount: unreadCount ? unreadCount.count : 0
            };
        });
        userListWithUnreadCounts.sort((a, b) => b.lastMessageTimestamp - a.lastMessageTimestamp);
        console.log(userListWithUnreadCounts)
        res.status(200).json({ message: "Got users", userData: userListWithUnreadCounts });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error fetching users", error: err });
    }
};


const getUnreadMessageCounts = async (trainerId) => {
    try {
        
        const unreadCounts = await Chat.aggregate([
            {
                $match: {
                    senderType: 'User', 
                    sender: { $ne: trainerId },
                    is_read: false 
                }
            },
            {
                $group: {
                    _id: "$sender", 
                    count: { $sum: 1 } 
                }
            }
        ]);

        return unreadCounts;
    } catch (error) {
        console.error("Error retrieving unread message counts:", error);
        throw error;
    }
};

const getSubscribedUser = async(req,res)=>{
  try{
    const trainerId = req.query.trainerId
    const userData = await User.find({subscribedTrainer:trainerId})
    res.status(200).json({userData});
  }catch(err){
    console.log(err)
  }
}

const getSubscribedUserSearch = async(req,res)=>{
  try{
    const search = req.query.text
    
    const trainerId = req.query.trainerId
    const userData = await User.find({
      subscribedTrainer:trainerId,
      $or: [
        { name: { $regex: new RegExp(search, "i") } },
       { email: { $regex: new RegExp(search, "i") } },
     ],
    })
    res.status(200).json({userData});
  }catch(err){
    console.log(err)
  }
}
module.exports = {
  verifyLogin,
  signUp,
  getTrainer,
  updateTrainer,
  profilePicUpload,
  getUsers,
  getSubscribedUser,
  getSubscribedUserSearch
};
