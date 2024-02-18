const mongoose=require('mongoose')

const chatRoom = mongoose.Schema({
    userId: {
         type: mongoose.Schema.Types.ObjectId, ref: 'User' 
    }, 
    trainerId: {
         type: mongoose.Schema.Types.ObjectId, ref: 'trainer'
    },
})

module.exports=mongoose.model('Chatroom',chatRoom);