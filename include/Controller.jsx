/**
 * @constructor
 */
Indigo.Controller = function() {
	this.setup();
};

/**
 * Вот тут-то и можно переопределить что угодно
 */
Indigo.Controller.prototype.setup = function() {
	var dataBroker = new Indigo.JsonBroker();
	this.messenger = new Indigo.HTTPMessenger(dataBroker);
};

/** 
 * Обработка заданий, основной цикл
 *
 * @param {array} jobs Массив объектов заданий
 */
Indigo.Controller.prototype.processJobs = function(jobs) {
	for (var jb=0, jl = jobs.length; jb < jl; jb++) {
		var action = jobs[jb].action;
		var data = jobs[jb].data;
		var worker = new Indigo[action]();
		// Отправить асинхронное уведомление о начале работы над заданием
		var feedback = { async: true, jobid: data._id, source: worker.name, info: 'start' };
		this.messenger.send('info', feedback);
		try {
			worker.setup(data);
			feedback.result = worker.run();
			feedback.info = 'finish';
			// Отправить уведомление о результатах работы
			this.messenger.send('info', feedback);
		} catch (err) {
			this.messenger.send('error', err);
		}
	}
};

/**
 * main()
 */
Indigo.Controller.prototype.run = function() {
	var jobs = this.messenger.receive('fetchJobs');
	if (typeof(jobs) === 'undefined') {
		return 'Job fetch error';
	}
	if (jobs.length < 1) {
		return 'No Jobs Present';
	} else {
		this.processJobs(jobs);
	}
};
