const Blog = require('../models/blog')

const addBlog = async(req,res)=>{
    try{
        console.log(req.body.data.title)
        const trainerId = req.body.id
        const data = req.body.data
        const blog = new Blog({
            trainerId:trainerId,
            title:data.title,
            content:data.content,
            author:data.author
        })

        const savedBlog = await blog.save();
        res.status(201).json({ message: 'Blog post created successfully', blog: savedBlog });
        
    }catch(err){
        console.error(err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

const getBlog = async(req,res)=>{
    try{
        console.log("blog")
        const trainerId = req.query.id
        console.log(trainerId)
        const blogs = await Blog.find({trainerId:trainerId})
        console.log(blogs)
        res.status(200).json({blogs:blogs})
    }catch(err){
        console.error(err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}
module.exports = {
addBlog,
getBlog
}