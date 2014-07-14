var _ = require('lodash'),
	io;
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

exports.notify = function(data, callback) {
	var messages = [];
	if (_.isArray(data.message)) {
		messages = data.message;
	} else {
		messages.push(data.message);
	}
	messages.forEach(function(message) {
		io.emit('jobstatus:changed', { status: message.status, _id: message._id });
	});
	callback(null, data);
};
