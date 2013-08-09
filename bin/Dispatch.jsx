/*
 * Dispatch relations between Illustrator And Bridge
 */

#include "/w/bin/mc.jsx"
#include "/w/bin/Assembly.jsx"
#include "/w/bin/Matching.jsx"
#include "/w/bin/Achtung.jsx"

BridgeTalk.onReceive = function (message) {
	$.writeln('Dispatch 11 Here');
	var job = eval(message.headers.job);
	// iterate thru jobs
	for (var jb=0, jl = job.length; jb < jl; jb++) {
		var actions = job[jb].sequence.split(';');
		// iterate on actions (assembly;matching;achtung)
		for (var act = 0, al = actions.length; act < al; act++) {
			var worker = eval('new ' + actions[act]);
			worker.setup(job[jb]);
			worker.run();
			}
	}
	// BridgeTalk want's this as result:
	//return job.toSource();
}
