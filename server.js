// const {app} = require("./app");
// const express = require("express");
// const port = 3000;

// const http = require("http");

// const server = http.createServer(app);

// server.listen(3000, () => {
// 	console.log("server running...");
// });

//const express = require("express");
const {app} = require("./app");
const {
	generateMessage,
	generateLocationMessage,
} = require("./connection/messages");
const port = process.env.PORT || 3000;
const socketio = require("socket.io");
const http = require("http");

const server = http.createServer(app);
const io = socketio(server);

//const io = require("socket.io")(server,{cors: {origin: "*"}});
// const io = require("socket.io")(server);


// server.listen(3000, ()=>
// {
//     console.log("server running...");
//  });


//  app.get("/", (req,res)=>
//  {
//      res.sendFile(__dirname +"/public/index.html");
//  })

//  io.on('connection', (socket)=>
//  {
     
//      //add to users:socketID dict/arr
//      console.log("user connected:"+socket.id);

//      //classA = handleLocationEventsFromSocket(socket);
//      //handleUserEventsFromSocket(socket);

//      socket.on('newUser', data =>
//      {
//          console.log("socket id:"+socket.id+","+ data);
//      })
//  });
 
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

// The original server. The addition of socket.io is not affecting for now.
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// connection to socket server //
io.on("connection", (connectedSocket) => {
	console.log(
		`A new user with socket id: ${connectedSocket.id} just connect to server`
	);
	connectedSocket.emit(
		"newMessage",
		generateMessage(
			"Admin",
			`Welcome to the App! you connected with socket id: ${connectedSocket.id}`
		)
	);
	connectedSocket.broadcast.emit(
		"newMessage",
		generateMessage(
			"Admin",
			`New user just joined, with socket id: ${connectedSocket.id}`
		)
	);
	connectedSocket.on("createMessage", (message, callback) => {
		console.log("createMessage", message);
		io.emit("newMessage", generateMessage(message.from, message.text));
		callback("This is the server!");
	});
	connectedSocket.on("createLocationMessage", (coords) => {
		io.emit(
			"newLocationMessage",
			generateLocationMessage("Admin", coords.lat, coords.lng)
		);
	});
	connectedSocket.on("disconnect", () => {
		console.log(
			`User with socket id: ${connectedSocket.id} disconnected from server`
		);
	});
});

server.listen(port, () => {
	console.log(`server running on port ${port}`);
});
