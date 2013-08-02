/*
 * Dispatch relations between Illustrator And Bridge
 *
 */
BridgeTalk.onReceive = function (message) {
	$.writeln('Dispatch Here');
	switch (message.type) {
		case "job":
			$.writeln('Dispatch Job Here');
			$.writeln(message.headers.job);
			job = eval(message.headers.job);
			$.evalFile('/w/bin/Run.jsx');
			break;
	}
	//return eval( message.body );
}
