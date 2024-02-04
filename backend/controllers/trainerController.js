const jwt = require("jsonwebtoken");
const argon2 = require("argon2");
const Trainer = require("../models/trainer");
const trainer = require("../models/trainer");
const path = require("path");
const cloudinary = require('cloudinary').v2;

require("dotenv").config();

const verifyLogin = async (req, res) => {
  try {
    const email = req.body.email;
    console.log(email);

    const userData = await Trainer.findOne({ email: email });
    console.log(userData);
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
          console.log("login");
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
    const existUser = await Trainer.findOne({ email: req.body.email });
    const userData1 = await Trainer.findOne({ mobile: req.body.mobile });
    const email = req.body.email.toLowerCase();
    console.log(email);
    // Initialize userDataMap as an empty object if it doesn't exist

    if (existUser == null && userData1 == null) {
      console.log(req.body.mobileNumber);
      const password = await argon2.hash(req.body.password);
      const trainer = new Trainer({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: email,
        mobile: req.body.mobileNumber,
        qualification: req.body.qualification,
        yearofexperience: req.body.yearofexperience,
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
    console.log(trianerId);

    const trainerData = await Trainer.findById(trianerId);
    console.log(trainerData);
    res.status(200).json({ trainerData: trainerData });
  } catch (err) {
    console.log(err);
  }
};

const updateTrainer = async (req, res) => {
  try {
    const trainerId = req.body.trainerId;
    const data = req.body.data;
    console.log(data);

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
    console.log("image")
    const trainerId = req.query.trainerId;
    const images = req.files.image;
    console.log("image")
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
module.exports = {
  verifyLogin,
  signUp,
  getTrainer,
  updateTrainer,
  profilePicUpload,
};
