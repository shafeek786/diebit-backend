const express = require('express')
const mongoose = require('mongoose')
require('dotenv').config()
const userRoute = require('./routes/userRoute')
const trainerRoute = require('./routes/trainerRoute')
const adminRoute = require('./routes/adminRoute')
const cors = require('cors')

const DB_URL = process.env.DB_URL
mongoose.connect(DB_URL)
    .then(()=>{
        console.log(`connected to mongoDB at ${DB_URL}`)
    })
    .catch((error)=>{
        console.error(`Error connecting to MongoDB: `, error.message)
    })
const app = express()
app.use(cors())
app.use(express.urlencoded({extended:true}))
app.use(express.json())
app.use('/',userRoute)
app.use('/admin',adminRoute)
app.use('/trainer',trainerRoute)




app.listen(process.env.PORT,console.log("connected"))