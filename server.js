var net = require('net');

var resultsHandler = net.createServer();

resultsHandler.on('connection', function(client) {
	client.write('Fuck Off\n');
	client.on('data', function(data) {
		console.log(data.toString());
	});
});

resultsHandler.listen(8080);


/**
var WebSocketServer = require('ws').Server,
	wss = new WebSocketServer({port:8080});

wss.on('connection', function(ws) {
	ws.on('message', function(message) {
		console.log('received: %s', message);
	});
});
*/
