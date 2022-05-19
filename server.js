const {app, jwt} = require("./app");
const WebSocket = require('ws');
const url = require('url');
const publicToken= require('./config/auth_config');
const port = process.env.PORT || 3000;
const http = require("http");

const server = http.createServer(app);
const wss = new WebSocket.Server({server});

var online_users=[];

wss.on('connection', (ws, req) =>
{
	var token = url.parse(req.url,true).query.token

	jwt.verify(token, publicToken, (err, payload) => 
	{
	  if(err) 
	  {
		  ws.close()
		  //return res.send("Not valid token, connection closed");
	  }

	  else
	  {
		  online_users[token] = ws;
	  }
	});

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
