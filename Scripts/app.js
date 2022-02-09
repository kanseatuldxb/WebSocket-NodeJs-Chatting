//1.
var webSocketServer = require('ws').Server;
var http = require('http');
var fs = require('fs');


clients =[]
//2.
var webSocketServerObject = new webSocketServer({port:9060});
function randomNumber(min, max) { 
    return Math.random() * (max - min) + min;
}
//3.
webSocketServerObject.on('connection',function(socketObject){
 
	//var connection = socketObject.accept('any-protocol', socketObject.origin);
	clients.push(socketObject);

	socketObject.on('message',function(message){
		console.log('The' + message +'Message Received from IP ' + socketObject.upgradeReq.connection.remoteAddress);
		//socketObject.send("Received " + message);
		//const messagedata = JSON.parse(message)
		clients.forEach(function(client) {
			if(socketObject != client){
				client.send(message);
			}
		});
	});
   
   socketObject.on('close',function(c,d){
	   console.log('Disconnect ' + c + ' -- ');
	   var i =0;
	   clients.forEach(function(client) {
			if(socketObject == client){
				clients.splice(i, 1);
			}
			i++;
		});
   });	
});	

//4.
var server = http.createServer(function(req,resp){
	
	fs.readFile("../Pages/Client.html", function (error, pgResp) {
            if (error) {
                resp.writeHead(404);
                resp.write('Contents you are looking are Not Found');
            } else {
                resp.writeHead(200, { 'Content-Type': 'text/html' });
                resp.end(pgResp);
            }
        });
});
//5.
server.listen(5050);

console.log('Server started');