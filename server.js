const {app} = require('./app');
const express=require("express");
const port = 3000;

const http= require('http');

const server = http.createServer(app);

//const io = require("socket.io")(server,{cors: {origin: "*"}});
const io = require("socket.io")(server);


server.listen(3000, ()=>
{
    console.log("server running...");
 });


 app.get("/", (req,res)=>
 {
     res.sendFile(__dirname +"/public/index.html");
 })

 io.on('connection', (socket)=>
 {
     
     //add to users:socketID dict/arr
     console.log("user connected:"+socket.id);

     //classA = handleLocationEventsFromSocket(socket);
     //handleUserEventsFromSocket(socket);

     socket.on('newUser', data =>
     {
         console.log("socket id:"+socket.id+","+ data);
     })
 });
 
//   class handleLocationEventsFromSocket{
//         constructor(socket){
//             this.socket = socket;
//             this.socket.on('location', this.handleGetLocation);
//             this.socket.on('resetLocation', this.resetLocation);
//         }

//          handleGetLocation(data){
//         // TODO
//         }

//         resetLocation(data){
//          // TODO
//         }
//  }
 

// //  //maybe to inform other users that user disconnected
//   socket.on("disconnect", () => {
//         console.log("Client disconnected")});
//         //remove from users:socketID arr/dict

