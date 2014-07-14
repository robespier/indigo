var _ = require('lodash');

/**
 * Когда-нибудь тут будет серьёзный логгер типа log4js
 */
exports.log = function(data, callback) {
	var messages = [];
	
	if (_.isArray(data.message)) {
		messages = data.message;
	} else {
		messages.push(data.message);
	}
	
	messages.forEach(function(message) {
		if (message.status === 'error') {
			console.error(
				'[%s]: Job "%s" (%s) raised error on %s',
				new Date(),
				message.action,
				message._id,
				message.agent
			);
		} else {
			console.log(
				'[%s]: Job "%s" (%s) %s from %s by %s',
				new Date(),
				message.action,
				message._id,
				message.status,
				message.agent,
				message.user
			);
		}
	});
	
	callback(null, data);
};
