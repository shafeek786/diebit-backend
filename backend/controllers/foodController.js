const Food = require("../models/food");
const FoodIntake = require('../models/foodIntake')
const moment = require("moment-timezone");

const addFood = async (req, res) => {
  try {
    // Destructure the fields from req.body
    console.log(req.body);
    const {
      name,
      category,
      energy,
      carbohydrate,
      fiber,
      sugar,
      protein,
      fat,
      vitamins: { a, b1, b2, b3, b5, b6, b9, b12, c, d, e, biotin },
      minerals: { calcium, iron, zinc, magnesium, copper, chromium, potassium },
    } = req.body;

    // Create a new Food instance
    const newFood = new Food({
      name,
      category,
      energy,
      carbohydrate,
      fiber,
      sugar,
      protein,
      fat,
      vitamins: {
        a,
        b1,
        b2,
        b3,
        b5,
        b6,
        b9,
        b12,
        c,
        d,
        e,
        biotin,
      },
      minerals: {
        calcium,
        iron,
        zinc,
        magnesium,
        copper,
        chromium,
        potassium,
      },
    });

    // Save the new Food document to the database
    const savedFood = await newFood.save();

    console.log("Food details saved:", savedFood);
    res.status(201).json({ message: "success" }); // Return the saved document if needed
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const loadFood = async (req, res) => {
  try {
    const foodData = await Food.find()
    console.log(foodData);
    res.status(200).json({ foodData: foodData });
  } catch (err) {
    console.log(err);
  }
};

const toggleBlockFood = async (req, res) => {
  try {
    const id = req.query.id;
    const data = await Food.findById(id);
    data.isBlocked = !data.isBlocked;
    console.log(data);
    await data.save();
    res.json({ message: "success" });
  } catch (err) {
    console.log(err);
  }
};

const deleteItem = async (req, res) => {
  try {
    const id = req.query.id;
    const data = await Food.findByIdAndDelete(id);
  } catch (err) {
    console.log(err);
  }
};

const foodSearch = async (req, res) => {
  try {
    const searchItem = req.query.query;
    console.log("Search Item:", searchItem);
    const data = await Food.find({
      $or: [
        { name: { $regex: ".*" + searchItem + ".*", $options: "i" } },
        { category: { $regex: ".*" + searchItem + ".*", $options: "i" } },
      ],
    });
    console.log(data);
    res.json({ foodData: data });
  } catch (err) {
    console.log(err);
  }
};

const selectFood = async(req,res)=>{
  try{
    const id = req.query.id
    const foodData = await Food.findById({_id:id})
    .select("name protien carbohydrate fat")
    .exec();
  console.log(foodData);
  res.status(200).json({ foodData: foodData });
  }catch(err){
    console.log(err)
  }
}


const addFoodTouser = async (req, res) => {
  try {
    const foodId = req.body.foodId;
    const userId = req.body.userId;
    const data = req.body.data;

   const foodData = await Food.findById({_id:foodId})

    // Create a new instance of the FoodIntake model
    const foodHistory = new FoodIntake({
      userId: userId,
      foodId: foodId,
      name:   foodData.name,
      servingSize: data.size, // Assuming data contains servingSize property
      quantity: data.quantity,
      calories: foodData.energy,
      protein:foodData.protein,
      carbohydrates:foodData.carbohydrate,
      fat:foodData.fat
    });

    // Save the new food intake record to the database
    const savedFoodHistory = await foodHistory.save();
    const foodHistory1 = await FoodIntake.find({ userId });
  
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);

    const todayFoodRecords = foodHistory1.filter(record => {
      const recordDate = new Date(record.date);
      return recordDate.getTime() >= today.getTime();
    });

    
    const todayCalorieIntake = todayFoodRecords.reduce((totalCalories, record) => {
      const caloriesWithQuantity = record.calories * record.quantity
      return totalCalories + caloriesWithQuantity
    }, 0);
    console.log("today"+ todayCalorieIntake)
    res.status(200).json({ message: 'Food added successfully', updatedCalories: todayCalorieIntake,foodHistory:todayFoodRecords });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const removeFoodHistory = async (req,res)=>{
  try{
    const userId = req.query.userId;
    console.log(userId)
    const entryId = req.query.entryId
    console.log(entryId)
    const selectedDate = req.query.selectedDate;
    const foodDataRemoved = await FoodIntake.findByIdAndDelete({_id:entryId})
    const momentDate = moment.tz(selectedDate, "Asia/Kolkata");
    const startDate = momentDate.clone().startOf("day");
    const endDate = momentDate.clone().endOf("day");
    const foodData = await FoodIntake.find({userId:userId})

    const foodHistory = foodData.filter((entry)=>{
      const recordDate = moment.tz(entry.date, "Asia/Kolkata")
      return recordDate.isSameOrAfter(startDate) && recordDate.isSameOrBefore(endDate)
    })
    const todayCalorieIntake = foodHistory.reduce((totalCalories, record) => {
      const caloriesWithQuantity = record.calories * record.quantity
      return totalCalories + caloriesWithQuantity
    }, 0);
   
    console.log(foodData)
    res.status(200).json({updatedCalories: todayCalorieIntake,foodHistory:foodData})

  }catch(err){
    console.log(err)
  }
}
 
module.exports = {
  addFood,
  loadFood,
  toggleBlockFood,
  deleteItem,
  foodSearch,
  addFoodTouser,
  removeFoodHistory
};
