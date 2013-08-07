/*
 * Dispatch relations between Illustrator And Bridge
 */
BridgeTalk.onReceive = function (message) {
	$.writeln('Dispatch 6 Here');
	job = eval(message.headers.job);
	result = $.evalFile('/w/bin/Run.jsx');
	// BridgeTalk want's this:
	result.toSource();
}
