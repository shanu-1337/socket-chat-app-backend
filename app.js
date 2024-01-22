const http = require('http')
const express = require('express')
const socketIO = require('socket.io')
const cors = require('cors')

const PORT = process.env.PORT || 8000 
const app = express()

const users= [{}]

app.use(cors())

app.get('/',(req,res)=>{
res.send('Backend')
})

const server =  http.createServer(app)

const io = socketIO(server)


io.on('connection',(socket)=>{
    console.log('New Connection');

    socket.on('joined',({user})=>{
        users[socket.id]=user
        console.log(`${user} has joined`);
        socket.broadcast.emit('userJoined',{user:"Admin",message:`${users[socket.id]}  Has Joined`})
        socket.emit('welcome',{user:"Admin",message:`Welcome to the Chat, ${users[socket.id]} `})
    })

    socket.on('message',({message,id})=>{
        io.emit('sendMessage',{user:users[id],message,id})
    })




    socket.on('disconnect', () => {
        console.log('User Left');
        socket.broadcast.emit('leave', { user: "Admin", message: `${users[socket.id]}  Has Left` });
    });
    





})

server.listen(PORT,()=>{
    console.log(`Server Started at ${PORT}`);
})


