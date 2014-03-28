
/*
 * GET home page.
 */

var MongoClient = require('mongodb').MongoClient,
	forms = require('../lib/forms');

/**
 * Закодировать не-ASCII символы в текстовых полях передаваемого объекта
 *
 * Похоже, что объект http из Adobe webaccesslib.dll кладёт с пробором на кодировку ответа. 
 * Ответ уходит в utf8 (проверено в Wireshark), однако в http.response оказывается хрень.
 * Установка http.responseencoding='utf8', как показано в документации Adobe, не помогает.
 *
 * Поэтому: здесь закодируем кириллицу в encodeURIComponent, а в Иллюстраторе вытащим ее 
 * обратно.
 *
 * @todo Рекурсивный обход объекта
 *
 * @param {object} 
 * @return {object}
 */
function encodeAdobe(obj) {
	Object.keys(obj).forEach(function(key) {
		if (typeof(obj[key]) === 'string') {
			obj[key] = encodeURIComponent(obj[key]);
		}
	});
	return obj;
}

exports.data = function(req,res) {
	var megaSwitch = {
		error: function() {
			var message = {};
			if (req.method === 'POST') {
				message = JSON.parse(req.body.parcel);
			}
			res.end();
		},
		info: function() {
			var message = {};
			if (req.method === 'POST') {
				message = JSON.parse(req.body.parcel);
			}
			res.end();
		},
		fetchJobs: function() {
			MongoClient.connect('mongodb://127.0.0.1:27017/indigo', function(err, db) {
				var jobsCollection = db.collection('indigoJobs');
				jobsCollection.find().nextObject(function(err, parcel) {
					var adobed = encodeAdobe(parcel); 
					res.json( 200, [{ 
						action: 'BlankComposer',
						data: adobed }]
					);
					res.end();
				});
			});
		},
		forms: function() {
			// Запрос может быть пустым
			if (!req._body) {
				res.end();
				return;
			}
			
			// Есть ли в запросе имя формы и есть ли у нас такая форма
			var form = {};
			if (typeof(forms[req.body.form]) === 'object') {
				form = forms[req.body.form];
			} else {
				res.end();
				return;
			}

			// Проверка введённых данных
			var request_data = form.check(req.body);

			MongoClient.connect('mongodb://127.0.0.1:27017/indigo', function(err, db) {
				var jobsCollection = db.collection(form.db.collection);
				jobsCollection.insert(request_data, function(err, result) {
					if (typeof(result) !== 'undefined') {
						// @todo redirect на страницу с результатом обработки.
						res.redirect('/'); 
					} else {
						res.send(500);
						res.end();
					}
				});
			});
		}
	};
	// req.params[1] пока что всегда 'json'; будут другие дата-брокеры -- будет разговор;
	var action = req.params[2];

	// Можем ли мы обработать этот запрос (есть ли такая функция, которую запросил клиент):	
	if (typeof(megaSwitch[action]) === 'function') {
		megaSwitch[action]();
	} else {
		res.send(404);
		res.end();
	}
};

exports.forms = function(req, res) {
	var form = req.params[1];
	res.render('form', { d: forms[form].metadata });
};

exports.tests = function(req, res) {
	switch(req.params[1]) {
		case 'fetchJobs':
			res.send(200, 'fetchjob.test');
		break;
		case 'info':
			res.send(200, 'info.test');
		break;
		case 'error':
			res.send(200, 'error.test');
		break;
	}
	res.end();
};
