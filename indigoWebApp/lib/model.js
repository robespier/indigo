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
		var templatesCollection = db.collection('indigoTemplates');
		templatesCollection.insert(parcel.result.data, {w: 1}, function(err) {
			if (err) {
				console.error('[%s]: Job %s failed with %s', new Date(), parcel.jobid, err);
			} else {
				console.info('[%s]: Job %s finished', new Date(), parcel.jobid);
			}
		});
	},
};
