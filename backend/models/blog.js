const mongoose =require('mongoose')

const blogSchema = new mongoose.Schema({
    trainerId:{
        type:String,
        require:true
    },
    title:{
        type:String,
        require: true
    },
    content:{
        type: String,
        require:true
    },
    author:{
        type:String,
        require:true
    }
})
const Blog = mongoose.model('Blog', blogSchema)
module.exports = Blog