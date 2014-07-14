var templates = require('../lib/templates');

/**
 * Запрос списока шаблонов
 */
exports.list = function(req, res) {
	templates.list({req: req}, function(err, docs) {
		if (err) { res.send(500); }
		else { res.json(docs); }
	});
};
