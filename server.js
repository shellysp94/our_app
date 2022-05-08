const {app} = require("./app");
const socketio = require("socket.io");
const http = require("http");
const {handleNewUser} = require("./connection/newUser");
const {removeDisconnectedUser} = require("./connection/removeUser");

//functions for chats
const {
	generateMessage,
	generateLocationMessage,
} = require("./connection/messages");
const users = require("./api/controllers/users");
const req = require("express/lib/request");


const port = process.env.PORT || 3000;

const server = http.createServer(app);
const io = socketio(server);

//const io = require("socket.io")(server,{cors: {origin: "*"}});
// const io = require("socket.io")(server);


global.usersArr = []; //delcare users arr - socket_id is user_id

 app.get("/", (req,res)=>
 {
     res.sendFile(__dirname +"/public/index.html");
 })



//*******************shelly's code***************************/

   io.on('connection', (socket)=>
 {
     
     //add to users:socketID dict/arr
     console.log("user connected:"+socket.id);

     //classA = handleLocationEventsFromSocket(socket);
     //handleUserEventsFromSocket(socket);

     socket.on('newUser', userData =>
     {
		 
		 handleNewUser(socket,userData);
     })
	 
	 socket.on("disconnect", () => {

		removeDisconnectedUser(socket);
		
		});
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

// The original server. The addition of socket.io is not affecting for now.
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// connection to socket server //




///**************************mor's code***********************/


// io.on("connection", (connectedSocket) => {
	
// 	console.log(
// 		`A new user with socket id: ${connectedSocket.id} just connect to server`
// 	);







// 	connectedSocket.emit(
// 		"newMessage",
// 		generateMessage(
// 			"Admin",
// 			`Welcome to the App! you connected with socket id: ${connectedSocket.id}`
// 		)
// 	);
// 	connectedSocket.broadcast.emit(
// 		"newMessage",
// 		generateMessage(
// 			"Admin",
// 			`New user just joined, with socket id: ${connectedSocket.id}`
// 		)
// 	);
// 	connectedSocket.on("createMessage", (message, callback) => {
// 		console.log("createMessage", message);
// 		io.emit("newMessage", generateMessage(message.from, message.text));
// 		callback("This is the server!");
// 	});
// 	connectedSocket.on("createLocationMessage", (coords) => {
// 		io.emit(
// 			"newLocationMessage",
// 			generateLocationMessage("Admin", coords.lat, coords.lng)
// 		);
// 	});
// 	connectedSocket.on("disconnect", () => {
// 		console.log(
// 			`User with socket id: ${connectedSocket.id} disconnected from server`
// 		);
// 	});
// });

server.listen(port, () => {
	console.log(`server running on port ${port}`);
});
