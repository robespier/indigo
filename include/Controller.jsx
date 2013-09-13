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
		// assign placeholder (array) for feedback from workers
		jobs[jb].errors = [];
		var actions = jobs[jb].sequence.split(';');
		// iterate on actions (assembly;matching;achtung)
		for (var act = 0, al = actions.length; act < al; act++) {
			var worker = eval('new Indigo.' + actions[act]);
			worker.setup(jobs[jb]);
			try {
				worker.run();
			} catch (err) {
				jobs[jb].errors.push(err);
			}
		}
	}
};

/**
 * main()
 */
Indigo.Controller.prototype.run = function() {
	var jobs = this.messenger.fetchJobs();
	if (jobs.length < 1) {
		return 'No Jobs Present';
	} else {
		this.processJobs(jobs);
	}
};
