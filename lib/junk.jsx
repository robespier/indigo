/**
 * Helper Test function
 * Serialize and save BridgeTalkMessage object
 */
function serializeMessage(message) {
	$.writeln('serializeMessage 9 Here');
	var msgOutput = new File('/w/bin/tests/message.jsn');
	msgOutput.open('w');
	for (var mp in message) {
		if (message.hasOwnProperty(mp)) {
			$.writeln(mp);
			msgOutput.writeln(mp + ': ' + message[mp]);
		}
	}
	
	msgOutput.writeln(message.headers.toSource());
	msgOutput.close();
}

			
		// Reconstruct BridgeTalkMessage from file
		var rmsgFile = new File("/w/bin/tests/rmessage.jsn");
		rmsgFile.open('r');
		rmsgBody = rmsgFile.read();
		rmsgFile.close();
		var rmessage = eval(rmsgBody);