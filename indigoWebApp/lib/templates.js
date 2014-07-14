/**
 * Выборка списка шаблонов
 *
 * @param {object} data
 * @param {function} callback
 */
exports.list = function(data, callback) {
	var templates = data.req.db.collection('indigoTemplates');
	templates.find().toArray(function(err, docs) {
		callback(err, docs);
	});
};
