// built-in NodeJS
const path = require('path');
const http = require('http');

// 3rd party packages
const express = require('express');
const socketIO = require('socket.io');

// my packages
const { generateMessage, generateLocation } = require('./helper/messageTemplate');
const Room = require('./models/Room');

// create server
const app = express();
const server = http.createServer(app);

const io = socketIO(server);

// serve static files
const publicPath = path.join(`${__dirname}/../public`)
app.use(express.static(publicPath))

const newRoom = new Room();
// MAIN PROCESS - CHAT APP
io.on("connection", (socket) => {
  socket.on('clientConnection', msg => {
    const { name, room } = msg;
    const user = {
      id: socket.id,
      name, room
    }
    newRoom.createUser(user)
    socket.join(room);

    socket.on("clientMessage", msg => {
      io.to(room).emit("fromServer", generateMessage(msg.from, msg.content))
    })
    socket.on("sendLocation", msg => {
      io.to(room).emit("sendLocationToOthers", generateLocation(msg.from, msg.lat, msg.lng))
    })
    socket.broadcast.to(room).emit("fromServer", generateMessage("Admin", `${name} joined room`))
    io.to(room).emit("userList", { userList: newRoom.users })
    socket.emit("fromServer", generateMessage("Admin", "Welcome to chat app"))

    socket.on("disconnect", () => {
      newRoom.deleteUserById(socket.id);
      io.to(room).emit("userList", { userList: newRoom.users })
      io.to(room).emit("fromServer", generateMessage("Admin", `${name} left`))
    })
  })
})

// run port
const port = process.env.PORT || 5000;
server.listen(port, () => {
  console.log(`App is running on port ${port}`)
})