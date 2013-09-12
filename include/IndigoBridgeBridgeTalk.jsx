///#target bridge-2.0
/**
 * Bridge static BridgeTalk.onReceive method 
 * Предполагается, что будет загружаеться из 
 * Startup Scripts CS3
 */

BridgeTalk.onReceive = function (message) {
	var c = new Indigo.Controller();
	if (c.isMethodAllowed(message.body)) {
		$.writeln('BridgeTalk.onReceive 17 Here: ' + message.body);
		var result = eval(message.body);
		message.sendResult(result.toSource());
	}
};

/**
 * Enable Web Access Library
 * Parital copy/paste form "JavaScript Tools Guide CS3.pdf", page 160
 */

var webaccesslib = new ExternalObject("lib:D:/bin/Adobe/Adobe Bridge CS3/webaccesslib.dll");
