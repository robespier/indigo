/*
 * Dispatch relations between Illustrator And Bridge
 */

#include "/w/bin/mc.jsx"
#include "/w/bin/Assembly.jsx"
#include "/w/bin/Matching.jsx"
#include "/w/bin/Achtung.jsx"

BridgeTalk.onReceive = dispatch;

function dispatch(message) {
	$.writeln('Dispatch 11 Here');
	var job = eval(message.headers.job);
	// iterate thru jobs
	for (var jb=0, jl = job.length; jb < jl; jb++) {
		// assign placeholder (array) for feedback from workers
		job[jb].errors = [];
		var actions = job[jb].sequence.split(';');
		// iterate on actions (assembly;matching;achtung)
		for (var act = 0, al = actions.length; act < al; act++) {
			var worker = eval('new ' + actions[act]);
			worker.setup(job[jb]);
			try {
				worker.run();
			} catch (err) {
				job[jb].errors.push(err);
			}
		}
	}
	// BridgeTalk want's this as result:
	return job.toSource();
}

/**
 * Helper Test Call
 */
if (typeof(AsyncTest) != "undefined") {
	$.writeln('Dispatch AsyncTest 11 Here');
	testResult = dispatch(AsyncTest.message);
}
