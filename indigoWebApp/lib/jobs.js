var async = require('async'),
	_ = require('lodash'),
	ObjectID = require('mongodb').ObjectID,
	postprocs = require('./postprocs');

/**
 * Закодировать не-ASCII символы в текстовых полях передаваемого объекта
 *
 * Похоже, что объект http из Adobe webaccesslib.dll кладёт с пробором 
 * на кодировку ответа. Ответ уходит в utf8 (проверено в Wireshark), однако 
 * в http.response оказывается хрень. Установка http.responseencoding='utf8',
 * как показано в документации Adobe, не помогает.
 *
 * Поэтому: здесь закодируем строки в encodeURIComponent, а в Иллюстраторе 
 * вытащим их обратно.
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
 * Особые обработчики
 */
var specific = {
	/**
	 * Создание в mongo задания для TemplateScanner
	 *
	 * В задание добавляется массив уже имеющихся в базе шаблонов,
	 * чтобы не сканировать их заново. Шаблоны, присутствующие в базе,
	 * но не помеченные статусом "done" будут отсканированы повторно.
	 *
	 * @param {boolean} data.message.rescan -- сброс коллекции шаблонов.
	 * Если установлен, коллекция indigoTemplates будет предварительно 
	 * очищена.
	 *
	 * Имеем три асинхронных операции: очистку, выборку и вставку.
	 * Завернём их в async.series([]);
	 *
	 * Когда задание возьмёт один из агентов, результаты его работы
	 * надо принять и обработать. В массиве callbacks передаётся имя 
	 * метода, который будет принимать результаты работы агента.
	 *
	 * @param {object} data 
	 * @param {function} callback
	 */
	chargeTS : function(data, callback) {
		var templates = data.req.db.collection('indigoTemplates'),
			jobs = data.req.db.collection('indigoJobs'),
			todo = _.merge(data.message, {
				action: "TemplateScanner",
				updated: new Date().getTime(),
				label_path: "",
				callbacks: ["storeTemplates"],
				templates: [],
				agent: 'PARTIZANEN',
				user: 'Anonymous',
			});
		async.series([
			function(cb) {
				if (todo.rescan) { 
					// параметр rescan установлен, следовательно, 
					// сканирование будет полным;
					// очищаем коллекцию indigoTemplates:
					templates.remove(function() {
						cb();
					});
				} else {
					// Выборка готовых шаблонов
					templates.find({status: "done"}, {_id: 0, name: 1})
						.each(function(err, templateName) {
							if (templateName === null) { cb(); } 
							else {
								todo.templates.push(templateName.name);
							}
					});
				}
			}, function() {
				// Вставка задания
				delete todo.run;
				jobs.insert(todo, function(err, result) {
					callback(err, {message: result[0]});
				});
			}
		]);
	},

	/**
	 * Распараллеливание заданий: сплиттер для AssemblyImposer
	 *
	 * Для каждой этикетки из принт-листа создаётся новое задание
	 * типа AssemblyImposer с одной этикеткой в принт-листе
	 *
	 * @param {object} job
	 * @param {array} jobList
	 */
	AssemblyImposer: function(job, jobList) {
		var labels = job.label_path.split('\n');
		labels.forEach(function(path) {
			job = _.clone(this);
			job.action = 'AssemblyImposer';
			job.label_path = path;
			job.updated = new Date().getTime();
			jobList.push(job);
		}, job);
	},
};

/**
 * Обновление задания в mongo
 *
 * @param {string|ObjectID} data.message._id обязательный параметр.  
 * Остальные данные вставляются "как есть".
 *
 * Перед обновлением объект данных клонируется и из него удаляется
 *  _id, потому что обновлять ObjectID в mongo нельзя; 
 *
 * @param {object} data 
 * @param {function} callback
 */
exports.update = function(data, callback) {
	var message = data.message,
		jobsCollection = data.req.db.collection('indigoJobs');

	if (typeof(message._id) === 'string') {
		message._id = new ObjectID(message._id);
	}

	var update = _.clone(message, true);
	update.updated = new Date().getTime();
	delete update._id;

	jobsCollection.findAndModify(
		{ _id: message._id }, 
		[], // sort parameter
		{ $set: update }, 
		{ upsert: true, w: 1, new: true},
		function(err, result) {
			data.message = result;
			callback(err, data);
		}
	);
};

/**
 * Выборка заданий для estk
 *
 * @param {number} data.message.limit количество заданий
 *
 * Выбирается определённое количество заданий со статусом
 * 'pending'. Статус этих заданий меняется на 'fetched',
 * чтобы исключить параллельную обработку одних и тех же
 * заданий разными агентами.
 *
 * Грязный хак с кодировкой ответа: Иллюстратору готовим
 * закодированный объект, а для вставки в базу сохраняем
 * нормальный. ObjectID у иллюстраторовского объекта
 * передаём как string, чтобы не париться на том конце
 * с преобразованиями BSON.
 *
 * @param {object} data 
 * @param {function} callback
 */
exports.fetch = function(data, callback) {
	var jobsCollection = data.req.db.collection('indigoJobs');
	jobsCollection.find({ status: 'pending' })
		.limit(data.message.limit)
		.toArray(function(err, result) {
			// Создаём массивы заданий для Иллюстратора и mongo;
			data.jobs = [];
			data.encoded = [];
			if (typeof(result) !== 'undefined' && result.length > 0) {
				result.forEach(function(job) {
					job.status = "fetched";
					job = _.merge(job, data.message);
					delete job.limit;
					data.jobs.push({
						action: job.action,
						data: job,
					});
					var encoded = _.clone(job, true);
					encoded._id = job._id.toString();
					data.encoded.push({
						action: encoded.action,
						data: encodeAdobe(encoded),
					});
				});
			}
			callback(null, data);
	});
};

/**
 * Создание задания для estk в mongo 
 *
 * @param {string} data.message.run Если в запросе есть имя метода
 * для особой обработки задания, выполнить его, иначе использовать
 * реализацию по умолчанию. Особые обработчики хранятся в объекте
 * specific.
 *
 * @param {object} data 
 * @param {function} callback
 */
exports.push = function(data, callback) {
	var message = data.message;
	message.status = 'pending';

	if (_.isFunction(specific[message.run])) {
		specific[message.run](data, callback);
		return;
	}
	// 
	// Распараллеливаем задания
	//
	// Мотивация: распиливание одного большого задания на более 
	// мелкие позволит распределить их выполнение между агентами;
	//
	// NB: AssemblyImposer имеет свой особый обработчик в объекте 
	// specific, и параллелиться будет по своему.
	var actions = message.actions ? message.actions : [];
	var splittedJobs = [];
	actions.forEach(function(action){
		// Задание не отмечено галкой, будет пропущено:
		if (!action.process) { return; }
		
		var job = _.clone(this);
		delete job.actions;
		job.agent = 'PARTIZANEN';
		job.user = 'Anonymous';
		
		if(_.isFunction(specific[action.name])) {
			specific[action.name](job, splittedJobs);
		} else {
			job.action = action.name; 
			job.updated = new Date().getTime();
			splittedJobs.push(job);
		}
	}, message);
	//
	// Вставка заданий, если есть
	//
	if (splittedJobs.lenght === 0) { return; }
	var jobsCollection = data.req.db.collection('indigoJobs');
	jobsCollection.insert(splittedJobs, function(err, result) {
		callback(err, { message: result });
	});
};

/**
 * Список всех заданий для estk из mongo
 *
 * Сортировка по умолчанию: сначала свежие
 *
 * @param {object} data 
 * @param {function} callback
 */
exports.list = function(data, callback) {
	var jobsCollection = data.req.db.collection('indigoJobs');
	jobsCollection.find().sort('updated', -1).toArray(function(err, docs) {
		callback(err, docs);
	});
};

/**
 * Запуск пост-процессоров в фоне
 * 
 * @todo Зачем я разбил их specific и postprocs?
 *
 * Если в задании присутствует массив callbacks и он содержит
 * имена существующих функций, они будут поставлены в очередь
 * на выполнение.
 *
 * @param {object} data 
 * @param {function} callback
 */
exports.queuePostProccessors = function(data, callback) {
	var message = data.message;
	
	var callbacks = message.callbacks ? message.callbacks : [];
	
	callbacks.forEach(function(cb) {
		try {
			var fn = postprocs[cb][message.status];
			if (_.isFunction(fn)) {
				process.nextTick(function() {
					fn(data, callback);
				});
			}
		} catch (e) {
			console.error(
				'Requested method not implemented: %s.%s()',
				cb,
				message.status
			);
		}
	});
	callback(null, data);
};
