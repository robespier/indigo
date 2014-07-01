var async = require('async');

/**
 * Тут обрабатываются запросы от контроллера Иллюстратора 
 *
 * `start`, `finish` -- см. Controller.jsx, 36, 48
 * `storeTemplates` -- метод, который мы выбрали в качестве обработчика (хранится в монге вместе с заданием)
 *
 */	

var ObjectID = require('mongodb').ObjectID;

exports.start = {
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
};

exports.finish = {
	/**
	 * Вставляем список шаблонов в коллекцию `indigoTemplates`
	 * @todo Обновляем статус задания: `done` или `error`
	 */
	storeTemplates: function(db, parcel) {
		var templatesCollection = db.collection('indigoTemplates'),
			templates = parcel.result.data;
		if (parcel.result.completed) {
			console.info('[%s]: Job %s finished, %s documents affected', new Date(), parcel.jobid, parcel.result.affected);
			return;
		}
		if (typeof(templates) === 'undefined' || (templates.length < 1))  {
			console.info('[%s]: Job %s Templates array is empty ', new Date(), parcel.jobid);
			return;
		}
		async.each(templates, function(t, callback) {
			templatesCollection.findAndModify({name: t.name}, [], t, {upsert: true, w: 1}, callback);
		}, function(err) {
			if (err) {
				console.error('[%s]: Job %s failed with %s', new Date(), parcel.jobid, err);
			} else {
				console.info('[%s]: Job %s finished', new Date(), parcel.jobid);
			}
		});
	},
};

/**
 * Создание в mongo задания для TemplateScanner
 *
 * @param {object} db MongoDB
 * @param {boolean} rescan
 */
exports.chargeTS = function(db, rescan) {
	var templates = db.collection('indigoTemplates'),
		jobs = db.collection('indigoJobs'),
		todo = {
			actions: [{
				name: "TemplateScanner",
				process: true
			}],
			status: "pending",
			label_path: "",
			callbacks:["storeTemplates"],
			templates: [],
		};
	async.series([
		function(callback) {
			if (rescan) { 
				// параметр rescan установлен, следовательно, сканирование будет полным;
				// значит, очищаем коллекцию indigoTemplates;
				templates.remove(function() {
					callback();
				});
			} else {
				templates.find({status: "done"}, {_id: 0, name: 1}).each(function(err, templateName) {
					if (templateName === null) { 
						callback(); 
					} else {
						todo.templates.push(templateName.name);
					}
				});
			}
		}, function() {
			jobs.insert(todo, {w: 0});
		}
	]);
};
