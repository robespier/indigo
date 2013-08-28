#target bridge-2.0

/**
 * Enable Web Access Library
 * Copy/paste form "JavaScript Tools Guide CS3.pdf", page 160
 */
if ( webaccesslib == undefined ) {
	if( Folder.fs == "Windows" ) {
		var pathToLib = Folder.startup.fsName + "/webaccesslib.dll";
	} else {
		var pathToLib = Folder.startup.fsName + "/webaccesslib.bundle";
		// verify that the path is valid
	}
	var libfile = new File( pathToLib );
	var webaccesslib = new ExternalObject("lib:" + pathToLib );
}

/**
 * Get Jobs Array from remote
 * @param form string Url
 */
function pullJobs(from) {
	var url = encodeURI(from);
	var http = new HttpConnection(url);
	http.requestheaders = ["User-Agent", "Indigo 1.0"];
	http.execute();
	return http.response;
}

/**
 * Post Results To Remote 
 */
function postMessage(data) {
	var http = new HttpConnection(remote);	
	//var parcel = "resp=" + data;
	var parcel = "XDEBUG_SESSION_START=netbeans-xdebug" + "&" + "resp=" + data;  
	http.mime =  "application/x-www-form-urlencoded";
	http.requestheaders = ["User-Agent", "Indigo 1.0"];
	http.request = parcel;
	http.method = "POST";
	http.execute();
}

function postResponse(message) {
	$.writeln('Controller onResult() Here');
	var resp = encodeResponse(eval(message.body));
	$.writeln(resp.toString());
	postMessage(resp.toString());
}	

/**
 * Do something with job
 */
function processJobs(j) {
	var scriptFile = new File("/w/bin/Dispatch.jsx");
	scriptFile.open('r');
	scriptBody = scriptFile.read();
	scriptFile.close();
	// Prepare to Talk
	var targetApp = BridgeTalk.getSpecifier( "illustrator", "13");
	if( targetApp ) {
		brt = new BridgeTalk();
		brt.target = "illustrator";
		brt.body = scriptBody;
		brt.headers.job = j.toSource();
		brt.onResult = postResponse;
		brt.onError = function( errorMsg ) {
			var errCode = parseInt (errorMsg.headers ["Error-Code"]);
			throw new Error (errCode, errorMsg.body);
		}
		brt.sendResult = function() {
			$.writeln('sendResult Controller');
		}
		brt.send();
	}
	return 'Controller 4 Done';
}

/**
 * Parse XML file to JavaScript job object
 * @returns array Array of Job objects
 */
#include "Job.jsx"
function parseJobs() {
	var from = remote + dataBroker.getURI();
	var response = pullJobs(from);
	var data = dataBroker.decode(response);
	if (typeof(AsyncDebug) != "undefined") {
		dataBroker._saveString(response);
	}
	return data;
}

function encodeResponse(resp) {
	var data = dataBroker.encode(resp);
	return data;
}

function run() {
	var jobs = parseJobs();
	if (jobs.length > 0) {
		processJobs(jobs);
	} else {
		return 'No Jobs Pulled';
	}
}
/*
 * Setup
 */
//AsyncDebug = true;
remote = "http://indigo.aicdr.pro/";

#include 'jsonBroker.jsx'
dataBroker = new jsonBroker();

/*
#include 'XMLBroker.jsx'
dataBroker = new XMLBroker();
*/

/*
var phpdata = dataBroker._loadJob();
dataBroker.decode(phpdata);
*/

/*
 * Run
 */ 
//dumpJobs();

run();

/*
while (true) {
	$.writeln('Check for new jobs');
	var jobs = parseJobs();
	processJobs(jobs);
	$.sleep(10000);
}
*/
