/**
 * Dispatch relations between Illustrator And Bridge
 * @constructor
 */
Indigo.Dispatcher = function() {};

Indigo.Dispatcher.prototype.send = function(message,responseCallback) {
	var targetApp = BridgeTalk.getSpecifier( "bridge", "2");
	if (targetApp) {
		var brt = new BridgeTalk();
		brt.target = "bridge";
		brt.body = message;
		brt.onResult = responseCallback;
		brt.onError = function( errorMsg ) {
			var errCode = parseInt (errorMsg.headers ["Error-Code"],10);
			throw new Error (errCode, errorMsg.body);
		};
		brt.send();
	}
	return 'Dispatcher.send 5 done';
};

Indigo.Dispatcher.processJobs = function(jobs) {
	$.writeln('Dispatcher.processJobs 8 Here');
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
	// BridgeTalk want's this as result:
	return jobs.toSource();
};

Indigo.Dispatcher.prototype.getJobs = function(message) {
	$.writeln('Dispatcher.getJobs Callback 18 Here');
	var jobs = eval(message.body);
	Indigo.Dispatcher.processJobs(jobs);
};

Indigo.Dispatcher.prototype.run = function() {
	// iterate thru jobs
	var job = this.send("c.parseJobs();",this.getJobs);
};

/**
 * Helper Test Call
 */
if (typeof(Indigo_UnitTests) === "undefined") {
	var d = new Indigo.Dispatcher();
	d.run();
}
