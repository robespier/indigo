var async = require('async'),
	io = require('../lib/socket.js'),
	logger = require('../lib/logger'),
	jobs = require('../lib/jobs');

/**
 *
 */
function getMessageFromReq(data, callback) {
	var message = {},
		req = data.req;
	try {
		message = JSON.parse(req.body.parcel);
	} catch (err) {
		callback(err);
	}
	callback(null, { message: message, req: req });
}

/**
 * Wrapper для async.waterfall
 */
function waterfall(seq, req, res) {
	seq.unshift(
		function(callback) {
			getMessageFromReq({req: req}, callback);
		}
	);
	
	async.waterfall(seq, function(err) {
		if (err) {
			console.error('[%s]: Job failed: "%s"', new Date(), err);
			res.send(500);
		} else {
			res.send(200);
		}
	});
}

/**
 * 
 */
exports.error = function(req, res) {
	var seq = [ jobs.update, logger.log, io.notify ];
	waterfall(seq, req, res);
};

/**
 *
 */
exports.info = function(req, res) {
	var seq = [ jobs.update, jobs.queuePostProccessors, logger.log, io.notify ];
	waterfall(seq, req, res);
};

/**
 * Запрос списка заданий для estk
 */
exports.fetch = function(req, res) {
	var seq = [ jobs.fetch,
		function(data, callback) {
			// Отдадим задания в Иллюстратор
			res.json(200, data.encoded);
			// Обновим статусы в базе
			data.jobs.forEach(function(job) {
				jobs.update({message: job.data, req: req}, callback);
				logger.log({message: job.data, req: req}, callback);
				io.notify({message: job.data, req: req}, callback);
			});
		}
	];
	waterfall(seq, req, res);
};

/**
 * Запрос на обновление задания
 */
exports.push = function(req, res) {
	var seq = [ jobs.push, logger.log, io.notify ];
	waterfall(seq, req, res);
};

/**
 * Запрос списка заданий для браузера
 */
exports.list = function(req, res) {
	jobs.list({req: req}, function(err, docs) {
		if (err) { res.send(500); } 
		else { res.json(docs); }
	});
};
