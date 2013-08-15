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
 * Helper function: Dump jobs from database to file
 */
function _dumpJobs() {
	var jobs = parseJobs();
	var jobOutput = new File('tests/jobsobj.jsn');
	jobOutput.open('w');
	jobOutput.write (jobs.toSource());
	jobOutput.close();
}

/**
 * Post Results To Remote 
 */
function postMessage(data) {
	var http = new HttpConnection(remote);	
	http.mime =  "application/x-www-form-urlencoded";
	http.requestheaders = ["User-Agent", "Indigo 1.0"];
	http.request = "resp=" + data;
	http.method = "POST";
	http.execute();
}

function postResponse(message) {
	$.writeln('Controller onResult() Here');
	var respXML = encodeResponse(eval(message.body));
	$.writeln(respXML.toString());
	postMessage(respXML.toString());
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

function parseJobsXML() {
	xmlJobList = new XML(pullJobs());
	var jobs = [];
	// Iterate thru jobs
	for (var i=0, l = xmlJobList.job.length(); i < l; i++) {
		j = new job();
		j.roll_number = xmlJobList.job[i].rollnumber.toString();
		j.hot_folder = xmlJobList.job[i].hotfolder.toString();
		j.template = xmlJobList.job[i].template.toString();
		j.dbid = xmlJobList.job[i].@job_id.toString();
		// Create print_list
		print_list = [];
		for (var pi=0, pl = xmlJobList.job[i].printlist.label.length(); pi < pl; pi++) {
			print_list.push(xmlJobList.job[i].printlist.label[pi].toString());
		}
		j.print_list = print_list;
		j.sequence = xmlJobList.job[i].sequence.toString();
		// Store Job in result array
		jobs.push (j);
	}
	return jobs;
}


function encodeResponse(resp) {
}

function _encodeResponse(resp) {
	var respXML = new XML('<jobsResponse/>');
	for (var rj = 0, rl = resp.length; rj < rl; rj++) {
		jobRespXML = new XML('<jobResp/>');
		if (resp[rj].errors.length > 0) {
			jobRespXML.status = 'issues';
			var jobIssuesXML = new XML('<troubles/>');
			for (var jiss = 0, jliss = resp[rj].errors.length; jiss < jliss; jiss++) {
				var jobIssueXML = new XML('<trouble/>');
				jobIssueXML.message = resp[rj].errors[jiss].message;
				jobIssueXML.source = resp[rj].errors[jiss].source;				
				jobIssueXML.file = resp[rj].errors[jiss].file;
				jobIssueXML.severity = resp[rj].errors[jiss].severity;
				jobIssueXML.jobid = resp[rj].errors[jiss].jobid;
				jobIssuesXML.appendChild(jobIssueXML);
			}
			jobRespXML.appendChild(jobIssuesXML);
		} else {
			jobRespXML.status = 'done';
		}
		jobRespXML.status.@jobid = resp[rj].dbid;
		respXML.appendChild(jobRespXML);
	}
	return respXML;
}

function run() {
	var jobs = parseJobs();
	if (jobs.length > 0) {
		processJobs(jobs);
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
//postMessage(j.dbid);
//postMessage();

*/