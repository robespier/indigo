/*
 * Dispatch relations between Illustrator And Bridge
 */

#include "/w/bin/mc.jsx"
#include "/w/bin/Assembly.jsx"
#include "/w/bin/Matching.jsx"
#include "/w/bin/Achtung.jsx"

BridgeTalk.onReceive = function (message) {
	$.writeln('Dispatch 9 Here');
	var job = eval(message.headers.job);
	
	//result = $.evalFile('/w/bin/Run.jsx');
	// BridgeTalk want's this:
	return job.toSource();
}
