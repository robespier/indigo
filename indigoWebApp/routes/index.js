
/*
 * GET home page.
 */

var MongoClient = require('mongodb').MongoClient;

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

/**
 * Объект с метаданными формы заказа
 */
var blankData = {
	title : 'Бланк заказа',
	id: 'fillBlank-form',
	name: 'fillBlank',
	method: 'POST',
	action: 'http://indigo.aicdr.pro:8080/data/json/fillBlank',
	fieldgroups : {
		base: {
			css: 'col-md-6',
			fields: [
				{ name: 'order', desc: '№ заказа', type: 'text'},
				{ name: 'customer', desc: 'Заказчик', type: 'text'},
				{ name: 'order_name', desc: 'Наименование заказа', type: 'text'},
				{ name: 'manager', desc: 'Менеджер', type: 'text'},
				{ name: 'master', desc: 'Технолог', type: 'text'}, 
				{ name: 'designer', desc: 'Дизайнер', type: 'text'} 
			]
		},
		suppl: {
			css: 'col-md-6',
			fields: [
				{ name: 'print_type', element: 'select', desc: 'Тип печати', options: ['цифровая','флексо']},
				{ name: 'label_type', element: 'select', desc: 'Тип этикетки', options: ['самоклеющаяся','термоусадочная','в оборот','in-mold']},
				{ name: 'roll_type', type: "radio", value: 'hand', content: 'ручная', desc: 'Тип намотки'},
				{ name: 'roll_type', type: "radio", value: 'auto', content: 'автоматическая' },
			]
		},
		submit: {
			css: 'col-md-12',
			fields: [
				{ name: 'submit', element: 'button', type: 'submit'}
			]
		}
	}
};

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
		fillBlank: function() {
			if (req._body) {
				MongoClient.connect('mongodb://127.0.0.1:27017/indigo', function(err, db) {
					var jobsCollection = db.collection('indigoJobs');
					var jobDocument = req.body;
					jobsCollection.insert(jobDocument, function(err, result) { });
					});
				}
			res.end();
		}
	};
	// req.params[1] пока что всегда 'json'; будут другие дата-брокеры -- будет разговор;
	var action = req.params[2];

	megaSwitch[action]();
};

exports.forms = function(req, res) {
	res.render('form', { d: blankData });
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
