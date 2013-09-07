var net = require('net');

var resultsHandler = net.createServer();

resultsHandler.on('connection', function(client) {
	client.on('data', function(data) {
		var parcel = JSON.parse(data);
		console.dir(parcel);
		console.log(data.toString());
		if (client.writable) {
			var testResponse = {
				"answer" : 42,
			};
			client.write(JSON.stringify(testResponse));
			console.log(JSON.stringify(testResponse));
		}
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
