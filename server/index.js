// built-in NodeJS
const path = require('path');
const http = require('http');

// 3rd party packages
const express = require('express');
const socketIO = require('socket.io');

// my packages
const { generateMessage, generateLocation } = require('./helper/messageTemplate');

// create server
const app = express();
const server = http.createServer(app);

const io = socketIO(server);

// serve static files
const publicPath = path.join(`${__dirname}/../public`)
app.use(express.static(publicPath))

// MAIN PROCESS - CHAT APP
io.on("connection", (socket) => {

  socket.on("clientMessage", msg => {
    io.emit("fromServer", generateMessage(msg.from, msg.content))
  })

  socket.on("sendLocation", msg => {
    io.emit("sendLocationToOthers", generateLocation(msg.from, msg.lat, msg.lng))
  })

  socket.on("disconnect", () => {
    console.log("User left")
  })
})

// run port
const port = process.env.PORT || 5000;
server.listen(port, () => {
  console.log(`App is running on port ${port}`)
})