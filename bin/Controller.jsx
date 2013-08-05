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
 */
function pullJobs() {
	var params = 'index.php?do=getJobs&status=go';
	var http = new HttpConnection(remote + params);
	http.execute();
	return http.response;
}

/**
 * Post Results To Remote 
 */
function postMessage(id) {
	var http = new HttpConnection(remote);
	http.mime =  "application/x-www-form-urlencoded";
	http.requestheaders = ["User-Agent", "Indigo 1.0"];
	http.request = "done=" + id;
	http.method = "POST";
	http.execute();
}

/**
 * Done something with job
 */
function doSomething(j) {
	scriptFile = new File("/w/bin/Dispatch.jsx");
	scriptFile.open('r');
	scriptBody = scriptFile.read();
	scriptFile.close();
	// Prepare to Talk
	var targetApp = BridgeTalk.getSpecifier( "illustrator", "13");
		if( targetApp ) {
			brt = new BridgeTalk();
			brt.target = "illustrator";
			brt.body = scriptBody;
			brt.type = 'job';
			brt.headers.job = j.toSource();
			brt.send();
		}
}

/**
 * Parse XML file to JavaScript job object
 * @param source File
 */
#include "Job.jsx"
function parseJobs() {
	xmlJobList = new XML(pullJobs());
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
		// Push Job
		doSomething(j);
		postMessage(j.dbid);
	}
}

/*
 * Setup
 */

remote = "http://indigo.aicdr.pro/";

parseJobs();
//postMessage();
