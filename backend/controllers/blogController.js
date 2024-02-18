const Blog = require('../models/blog')
const cloudinary = require('cloudinary').v2;

const addBlog = async(req,res)=>{
    try{
        const trainerId = req.body.id;
        const data = JSON.parse(req.body.data)
        const images = req.files.image;
    console.log("image")
    let imagesPath = [];
    for (const image of images) {
      try {
        const result = await cloudinary.uploader.upload(image.path, {
          folder: 'profile_pics',
          width:250,
          height: 300,
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
        const blog = new Blog({
            trainerId: trainerId,
            title: data.title,
            content: data.content,
            blogImage:imagesPath,
            author: data.author
        });

        const savedBlog = await blog.save()
        const blogs = await Blog.find({ trainerId: trainerId }).sort({ _id: -1 });

        res.status(201).json({ message: 'Blog post created successfully', blog: blogs });
        
    } catch(err) {
        console.error(err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};



const getBlog = async(req,res)=>{
    try{
        console.log("blog")
        const trainerId = req.query.id
        console.log(trainerId)
        const blogs = await Blog.find({trainerId:trainerId}).sort({_id:-1})
        console.log(blogs)
        res.status(200).json({blogs:blogs})
    }catch(err){

        console.error(err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

const deleteBlog = async(req,res)=>{
    try{
        const blogId = req.query.blogId
        const trainerId = req.query.trainerId
        await Blog.findOneAndDelete({_id:blogId})
        const blogs = await Blog.find({trainerId:trainerId}).sort({_id:-1})
        res.status(200).json({blogs:blogs})

    }catch(err){
        console.error(err);
        res.status(500).json({ message: 'Internal Server Error' });
    }

}

const getBlogById = async(req,res)=>{
    try{
        const blogId = req.query.blogId
        console.log(blogId)
        const blog = await Blog.findById(blogId).sort({_id:-1})
        console.log(blog)
        res.status(200).json({blog:blog})
    }catch(err){
        console.log(err)
    }
}

const updateBlog = async(req,res)=>{
    try{
        const blogId  = req.body.id
        console.log(blogId)
        const data = req.body.data
        const updateData = await Blog.findByIdAndUpdate({_id:blogId},{
            title: data.title,
            content: data.content,
            blogImage: data.blogImage,
            author: data.author
        })

        const blog = await Blog.findOne({trainerId: updateData.trainerId}).sort({_id:-1})
        res.status(201).json({ message: 'Blog post created successfully', blog: blog });
    }catch(err){
        console.log(err)
    }
}

const updateBlogWithImage = async(req,res)=>{

    try{
        console.log("check")
        const blogId = req.body.id;
        console.log(blogId); 
        const data = JSON.parse(req.body.data)
        console.log(data.title)
        const images = req.files.image;
    console.log("image")
    let imagesPath = [];
    for (const image of images) {
      try {
        const result = await cloudinary.uploader.upload(image.path, {
          folder: 'profile_pics',
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
    const updateData = await Blog.findByIdAndUpdate({_id:blogId},{
        title: data.title,
        content: data.content,
        blogImage: imagesPath,
        author: data.author
    })
    console.log(updateData)

        const blog = await Blog.findOne({trainerId: updateData.trainerId}).sort({_id:-1})
        res.status(201).json({ message: 'Blog post created successfully', blog: blog });
    }catch(err){
        console.log(err)
    }
}

const getBlogs = async(req,res)=>{
  try{
      console.log("blogdddd")
      const blogs = await Blog.find().sort({_id:-1})
      console.log(blogs)
      res.status(200).json({blogs:blogs})
  }catch(err){

      console.error(err);
      res.status(500).json({ message: 'Internal Server Error' });
  }
}
module.exports = {
addBlog,
getBlog,
deleteBlog,
getBlogById,
updateBlog,
updateBlogWithImage,
getBlogs
}