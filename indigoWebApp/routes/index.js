
/*
 * GET home page.
 */

var MongoClient = require('mongodb').MongoClient,
	ObjectID = require('mongodb').ObjectID;

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

	/**
	 * Тут обрабатываются запросы от контроллера Иллюстратора 
	 *
	 * `start`, `finish` -- см. Controller.jsx, 36, 48
	 * `storeTemplates` -- метод, который мы выбрали в качестве обработчика (хранится в монге вместе с заданием)
	 *
	 */	
	var model = {
		start: {
			/**
			 * Обновляем статус задания: с `pending` на `running`
			 */
			storeTemplates: function(db, parcel) {
				var id = new ObjectID(parcel.jobid);
				var jobsCollection = db.collection('indigoJobs');
				jobsCollection.update({_id: id}, {$set: {status: "running"}}, function() {
					console.info('[%s]: Job %s started from %s by %s', new Date(), parcel.jobid, parcel.host, parcel.user);
				});
			},
		},
		finish: {
			/**
			 * Вставляем список шаблонов в коллекцию `indigoTemplates`
			 * @todo Обновляем статус задания: `done` или `error`
			 */
			storeTemplates: function(db, parcel) {
				var templatesCollection = db.collection('indigoTemplates');
				templatesCollection.insert(parcel.result.data, {w: 1}, function(err) {
					if (err) {
						console.err('[%s]: Job %s failed with %s', new Date(), parcel.jobid, err);
					} else {
						console.info('[%s]: Job %s finished', new Date(), parcel.jobid);
					}
				});
			},
		},
	};

	var megaSwitch = {
		error: function() {
			var message = {};
			if (req.method === 'POST') {
				message = JSON.parse(req.body.parcel);
			}
			res.end();
		},
		/**
		 * Тут маршрутизируются запросы от Иллюстратора со статусом `info`
		 *
		 * При получении запроса мы:
		 * 
		 * * преобразуем сообщение из тела запроса в объект `message`;
		 * * достаем из этого объекта id задания и делаем из него монговский ObjectID;
		 * * тянем из коллекции indigoJobs это задание по его ObjectID и смотрим массив callbacks;
		 * * если в массиве callbacks нашлись функции, которые можно выполнить, то 
		 *   выполняем их асинхронно (точнее, ставим в очередь на выполнение в process.nextTick);
		 * * 
		 */
		info: function() {
			var message = {};
			if (req.method === 'POST') {
				message = JSON.parse(req.body.parcel);
				var id = new ObjectID(message.jobid);
				MongoClient.connect('mongodb://127.0.0.1:27017/indigo', function(err, db){
					var jobsCollection = db.collection('indigoJobs');
					jobsCollection.find({_id: id}).nextObject(function(err, parcel) {
						var i = message.info;
						var callbacks = parcel.callbacks;
						Object.keys(callbacks).forEach(function(key) {
							try {
								var fn = model[i][callbacks[key]];
								if (typeof(fn) === 'function') {
									process.nextTick(function() {
										fn(db, message);
									});
								}
							} catch (e) {
								console.error('Requested method not implemented yet: %s.%s', i, callbacks[key]);
							}
						});
					});
				});
			}
			res.end();
		},
		fetchJobs: function() {
			MongoClient.connect('mongodb://127.0.0.1:27017/indigo', function(err, db) {
				var jobsCollection = db.collection('indigoJobs');
				jobsCollection.find({status:'pending'}).nextObject(function(err, parcel) {
					// Создаём массив заданий для Иллюстратора
					var jobs = [];
					var adobed = encodeAdobe(parcel); 
					Object.keys(parcel.actions).forEach(function(key) {
						if (parcel.actions[key].process) {
							jobs.push({
								action: parcel.actions[key].name,
								data: adobed,
							});
						}
					});
					// Держи, кормилец:
					res.json( 200, jobs );
					res.end();
				});
			});
		},
		pushJob: function() {
			MongoClient.connect('mongodb://127.0.0.1:27017/indigo', function(err, db) {
				if (err) {
					res.send(500);
					return;
				}
				var workset = req.body;
				var jobs = db.collection('indigoJobs');
				jobs.remove(function(){
					jobs.findAndModify({_id: 'current'}, [], workset, {upsert: true, w: 1}, function(err, result) {
						if (err) {
							res.send(500);
						} else {
							res.send(200, result);
						}
					});
				});
			});
		},
	};
	// req.params[1] пока что всегда 'json'; будут другие дата-брокеры -- будет разговор;
	var action = req.params[2];

	megaSwitch[action]();
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

exports.forms = function(req, res) {
    // Если в запросе есть `_id`, заполним форму из базы, иначе покажем пустую
    if (typeof(req.query._id) !== 'undefined') {
		var	order = {
			"order": "214Ц01892/3",
			"customer": "Артлайф ООО",
			"order_name": "БАДы для Индии (в ассортименте)",
			"manager": "Лотфуллина Э.",
			"master": "Альмухаметов А.",
			"designer": "Сергеев Р.",
			"label_type": "self-label",
			"print_type": "digital",
			"cut": "ready",
			"cut_number": "1152704",
			"size_x": 53.5,
			"size_y": 153.75,
			labels: [
				{
					name: "Глюкосил 90 таб",
					file: '',
				},
				{
					name: "Джоинт флекс 90 таб",
					file: '',
				},
				{
					name: "Грин Стар 45 кап",
					file: '',
				},
				{
					name: "Бурдок С 90 таб",
					file: '',
				},
				{
					name: "Формула женщины 90 таб",
					file: '',
				},
				{
					name: "Мемори райс 90 таб",
					file: '',
				},
				{
					name: "Комплекс ферментов 90 таб",
					file: '',
				},
				{
					name: "Хепар 90 таб",
					file: '',
				},
			],
			inks: [
				{ name: 'Opaque', used: false },
				{ name: 'Cyan', used: true },
				{ name: 'Magenta', used: true },
				{ name: 'Yellow', used: true },
				{ name: 'Black', used: true },
				{ name: 'Orange', used: false },
				{ name: 'Violet', used: true },
			],
			"pms_1": "false",
			"pms_2": "false",
			"pms_3": "false",
			"pms_4": "false",
			"pms_5": "false",
			"pms_6": "false",
			"pms_7": "false",
			"lak": "select",
			"tis": "free",
			"roll": "auto", 
			"roll_type": "outside", 
			"roll_dir": "head_forward",
		};
		res.json(order);
    } else {
		res.json({});
    }
};

