/**
 * Dispatch relations between Illustrator And Bridge
 */

#include "/w/include/indigo-ill.jsxinc"

BridgeTalk.onReceive = dispatch;

function dispatch(message) {
	$.writeln('Dispatch 16 Here');
	var sr1 = message.sendResult('well');
	$.writeln('sendResult 1 returns:' + sr1);
	var job = eval(message.headers.job);
	// iterate thru jobs
	for (var jb=0, jl = job.length; jb < jl; jb++) {
		// assign placeholder (array) for feedback from workers
		job[jb].errors = [];
		var actions = job[jb].sequence.split(';');
		// iterate on actions (assembly;matching;achtung)
		for (var act = 0, al = actions.length; act < al; act++) {
			var sr2 = message.sendResult('done');
			$.writeln('sendResult ' + act + ' returns:' + sr2);
			var worker = eval('new Indigo.' + actions[act]);
			worker.setup(job[jb]);
			try {
				worker.run();
			} catch (err) {
				job[jb].errors.push(err);
				var errm = {
					type: "error",
					severity: "fatal",
				};
				message.sendResult(errm);
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
