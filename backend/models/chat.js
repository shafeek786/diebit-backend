const mongoose = require('mongoose')

const chatSchema = new mongoose.Schema({
    room: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ChatRoom',
      },
      sender: {
        type: mongoose.Schema.Types.ObjectId,
        // required: true,
        refPath: 'senderType',
      },
      senderType: {
        type: String,
        enum: ['User', 'Trainer'],
        // required: true,
      },
      content: {
        type: String,
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },is_read:{
        type:Boolean,
        default:false
      }
},
{timestamps:true}
)

const Chat = mongoose.model('Chat', chatSchema);
module.exports = Chat