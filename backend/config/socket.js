const socketManager = (io) => {

    const emailToSocketIdMap = new Map();
    const socketIdToEmailMap = new Map();
 
   io.on("connection", (socket) => {
    //  console.log(`Socket Connected: ${socket.id}`);
 
     // Mentor joining
     socket.on("mentor-room:join", (data) => {
       // console.log(data);
       const { email ,room} = data;
       emailToSocketIdMap.set(email,socket.id);
       socketIdToEmailMap.set(socket.id,email);
       socket.join(room);   // Room join 
     });
 
     // Mentee joining to the room
     socket.on('mentee-room:join',data=>{
       const {email,room} = data;
       // console.log(`User ${data.email} joined room ${data.room}`);
       socket.join(room);
       io.to(room).emit('user:joined',socket.id);
     })
 
     // Mentor call to mentee
     socket.on("user:call",({to,offer})=>{
       // console.log(`Mentor ${socket.id} initiated a call to ${to}`);
       io.to(to).emit("incoming:call",{from:socket.id,offer});
     })
 
     // Call accepting
     socket.on('call:accepted',(data)=>{
       // console.log(Object.values(data)[0].ans, 'Data in the call:accept event');
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
 };
 
 module.exports = socketManager;