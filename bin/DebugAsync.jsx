/**
 * Create mock object for unit tests and debug
 */

#include '/w/bin/JsonBroker.jsx'
var jb = new jsonBroker();
var jobs = jb._loadJob();

headers = {
	job : jobs,
}

message = {
	headers: headers,
	body: "EMPTY",
	sender: "bridge-2.0",
	target: "illustrator-13.0-ru_ru",
	timeout: "600",
	type: "ExtendScript",
}

AsyncTest = {
	done: false,
	message: message,
	loadMessage : function() {
		// Reconstruct BridgeTalkMessage
		return;
	},
}

#include Dispatch.jsx
