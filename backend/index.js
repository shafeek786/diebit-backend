const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
require('dotenv').config()
const userRoute = require('./routes/userRoute')
const trainerRoute = require('./routes/trainerRoute')
const adminRoute = require('./routes/adminRoute')
const path = require('path');

const DB_URL = process.env.DB_URL
mongoose.connect(DB_URL)
    .then(()=>{
        console.log(`connected to mongoDB at ${DB_URL}`)
    })
    .catch((error)=>{
        console.error(`Error connecting to MongoDB: `, error.message)
    })
const app = express()
app.use(
    cors({
      origin: '*',
      methods: ["GET", "POST", "DELETE", "PUT", "PATCH"],
      credentials: true,
    })
  );
  const port = process.env.PORT || 3000;
let http = require('http');
let server = http.Server(app);

const io = require('socket.io')(server,{       
    pingTimeout: 60000,
    cors:{
      origin: [
        "http://localhost:4200",
        "https://diebit.world",
       
      ],
         methods: ['GET','POST'] 
        
    }
 }) 


 const emailToSocketIdMap = new Map();
 const socketIdToEmailMap = new Map();
io.on('connection', (socket) => {
    console.log(`New connection ${socket.id}`)
    socket.on('join', (data) => {
        socket.join(data.room);
        socket.broadcast.to(data.room).emit('user joined');
    });

    socket.on('message', (data) => {
        console.log(data)
        io.in(data.room).emit('new message', {user: data.user, message: data.message});
    });

    socket.on("mentor-room:join", (data) => {
        console.log(data);
        const { email ,room} = data;
        emailToSocketIdMap.set(email,socket.id);
        socketIdToEmailMap.set(socket.id,email);
        socket.join(room);   // Room join 
      });
  
      // Mentee joining to the room
      socket.on('mentee-room:join',data=>{
        const {email,room} = data;
        console.log(`User ${data.email} joined room ${data.room}`);
        socket.join(room);
        io.to(room).emit('user:joined',socket.id);
      })
     // Mentor call to mentee
     socket.on("user:call",({to,offer})=>{
         console.log(`Mentor ${socket.id} initiated a call to ${to}`);
        io.to(to).emit("incoming:call",{from:socket.id,offer});
      })
  
      // Call accepting
      socket.on('call:accepted',(data)=>{
         console.log(Object.values(data)[0].ans, 'Data in the call:accept event');
        io.to(Object.values(data)[0].to).emit("call:accepted", { from: socket.id, ans:Object.values(data)[0].ans });
      })
  
      // Peer negotiation needed
      socket.on('peer:nego:needed',(data)=>{
        const {to,offer} = data;
        io.to(to).emit('peer:nego:needed',{from:socket.id,offer});
      })
  
      // Peer negotiation done
      socket.on('peer:nego:done',(data)=>{
        const {to,ans} = data;
        io.to(to).emit('peer:nego:final',{from:socket.id,ans});
      })
  
      // Disconnect call
      socket.on('disconnect:call',(data)=>{
        const {to} = data;
        const email = socketIdToEmailMap.get(to);
  
        if(email){
          emailToSocketIdMap.delete(email);
          socketIdToEmailMap.delete(to);
        }
  
         const targetSocket = io.sockets.sockets.get(to);
         if(targetSocket){
          targetSocket.disconnect();
         }
      })
});

app.use('/images', express.static(path.join(__dirname, 'images')));
app.use(express.urlencoded({extended:true}))
app.use(express.json())
app.use('/api',userRoute)
app.use('/api/admin',adminRoute)
app.use('/api/trainer',trainerRoute)






server.listen(port, () => {
    console.log(`started on port: ${port}`);
});