/**
 * @constructor
 */
Indigo.Controller = function() {
	this.setup();
};

/**
 * @prop {string} remote Адрес Web-сервера
 */
Indigo.Controller.prototype.remote = '';

Indigo.Controller.prototype.setup = function() {
	this.remote = "http://indigo.aicdr.pro/";
	this.dataBroker = new Indigo.JsonBroker();
};

/**
 * Post Results To Remote 
 *
 * @param {string} data Encoded JavaScript object
 */
Indigo.Controller.prototype.postMessage = function(data) {
	var http = new HttpConnection(this.remote);	
	//var parcel = "resp=" + data;
	var parcel = "XDEBUG_SESSION_START=netbeans-xdebug" + "&" + "resp=" + data;  
	http.mime = "application/x-www-form-urlencoded";
	http.requestheaders = ["User-Agent", "Indigo 1.0"];
	http.request = parcel;
	http.method = "POST";
	http.execute();
};

/**
 * Get Jobs Array from remote
 *
 * @param {string} form Url
 * @return {string} response Json string
 */
Indigo.Controller.prototype.pullJobs = function(from) {
	var url = encodeURI(from);
	var http = new HttpConnection(url);
	http.requestheaders = ["User-Agent", "Indigo 1.0"];
	http.execute();
	return http.response;
};

/**
 * Parse jobs from remote source to JavaScript job object
 *
 * @return {array} data Array of Job objects
 */
Indigo.Controller.prototype.parseJobs = function() {
	var from = this.remote + this.dataBroker.getURI();
	var response = this.pullJobs(from);
	var data = this.dataBroker.decode(response);
	if (typeof(Indigo_UnitTests) !== "undefined") {
		this.dataBroker.saveString(response);
	}
	return data;
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
	var jobs = this.parseJobs();
	if (jobs.length < 1) {
		return 'No Jobs Present';
	} else {
		this.processJobs(jobs);
	}
};
