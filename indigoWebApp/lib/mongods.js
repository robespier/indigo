/**
 * Монго db в качестве express middleware
 * 
 * Создание соединеня с моного и сохранение ссылки
 * на базу данных в объекте запроса (req);
 *
 * Установка:
 * 
 * var mongods = require('path/to/this/file');
 * app.use(mongods(config));
 * config.dburl -- строка подключения к серверу mongo
 *
 * Использование:
 *
 * req.db.collection(...).find(...);
 */
var MongoClient = require('mongodb').MongoClient,
	database;

module.exports = function(config) {
	MongoClient.connect(config.dburl, function(err, db) {
		if (err) {
			console.error('MongoDB trouble: %s', err);
			return;
		}
		database = db;
	});
	return function(req, res, next) {
		req.db = database;
		next();
	};
};	
