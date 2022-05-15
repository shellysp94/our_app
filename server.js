const {app} = require("./app");
const WebSocket = require('ws');

const port = process.env.PORT || 3000;
const http = require("http");

const server = http.createServer(app);
const wss = new WebSocket.Server({server});

var user_dict={};

wss.on('connection', (ws) =>
{
	console.log('A new client connected');
	ws.send('Welcome new client');

	user_dict[1] = ws
	console.log(user_dict);

	ws.on('message', (message) =>
	{
		ws.send('Got ur message, its '+ message);
	})
	

})


 app.get("/", (req,res)=>
 {
     res.sendFile(__dirname +"/public/new_index.html");
 })


server.listen(port, () => {
	console.log(`server running on port ${port}`);
});
