var io;
	//clients = [];

exports.init = function(server) {
	
	io = require('socket.io').listen(server);
	
	io.sockets.on('connection', function(socket) {
		//clients.push(socket);
		socket.emit('jobstatus:changed', {hello:'world'});
	});
};

exports.emit = function(name, data) {

	// Да, это io, сообщение всем клиентам
	io.emit(name, data);

};
