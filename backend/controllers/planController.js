const SubscriptionPlan = require('../models/SubscriptionPlan')
const Plan = require('../models/SubscriptionPlan')
const User = require('../models/user')

const addPlan = async(req,res)=>{
    try{
        const formData = req.body
        console.log(formData)
        const plan = new Plan({
            planType:formData.planType,
            price:formData.price,
            blog:formData.blog,
            chat: formData.chat,
            trainer:formData.trainer,
            progressTracking:formData.progressTracking,
            workoutPlan:formData.workoutPlan,
            videoCall:formData.videoCall
        })
        console.log(plan)
        await plan.save()
    res.status(200).json({mesaage:"Plan added"})
    }catch(err){
        console.log(err)
    }
}


const getPlan = async(req,res)=>{
    try{
        console.log("subscription")
        const plans = await SubscriptionPlan.find()
        console.log(plans)
        res.status(200).json({plans:plans})
    }catch(err){
        console.log(err)
    }
}

const getPlanWithId = async(req,res)=>{
    try{
        const planId = req.query.planId
        const plan = await SubscriptionPlan.findById(planId)
        res.status(200).json({plan:plan})
    }catch(err){
        console.log(err)
    }
}

const editPlan = async(req,res)=>{
    try{
        const planId = req.body.planId
        const formData = req.body.planData
        const update = await SubscriptionPlan.findByIdAndUpdate({_id:planId},{
            planType:formData.planType,
            price:formData.price,
            blog:formData.blog,
            chat: formData.chat,
            trainer:formData.trainer,
            progressTracking:formData.progressTracking,
            workoutPlan:formData.workoutPlan,
            videoCall:formData.videoCall
        })
        if(update){
            res.status(200).json({message:'success'})
          }
    }catch(err){
        console.log(err)
    }
}

const userPlanUpdate = async (req, res) => {
    try {
        const userId = req.body.userId;
        const planId = req.body.planId;
        const planData = await Plan.findById(planId);
        const startDate = new Date();
        const endDate = new Date(startDate.getTime() + 30 * 24 * 60 * 60 * 1000);

        const updatePlan = await User.findByIdAndUpdate(
            { _id: userId },
            {
                $push: {
                    subscription: {
                        planId: planId,
                        planName: planData.planName,
                        startDate: startDate,
                        endDate: endDate,
                        isActive: true
                    }
                }
            },
            { new: true }
        );

        res.status(200).json({ message: 'success', user: updatePlan });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error updating user subscription plan' });
    }
};

const checkSubscription = async(req,res)=>{
    try{
        const userid = req.query.userId
        const userData = await User.findById(userid)
        console.log(userData)
        if(userData.subscription && userData.subscription.length > 0){
            const activeSubscription = userData.subscription.find(sub=>sub.isActive)
            console.log("Active: "+activeSubscription)
           
            if(activeSubscription.isActive === true ){
                console.log("Active user")
                res.status(200).json({isActive:true})
            }else{
                res.status(200).json({isActive:false})
            }
        }

    }catch(err){
        console.error(err);
        res.status(500).json({ message: 'Error updating user subscription plan' });
    }
}
module.exports = {
    addPlan,
    getPlan,
    getPlanWithId,
    editPlan,
    userPlanUpdate,
    checkSubscription
}