#include "DataBroker.jsx"

function XMLBroker() {}

XMLBroker.prototype = new dataBroker();
XMLBroker.prototype.constructor = XMLBroker;
XMLBroker.prototype.type = 'xml';

/**
 * Interface realization
 */

XMLBroker.prototype.encode = function (obj) {
	return this.toXML(obj);
},

XMLBroker.prototype.decode = function (string) {
	return this.fromXML(string);
},

XMLBroker.prototype.toXML = function(obj) {

},

XMLBroker.prototype.fromXML = function(string) {
	var inXML = new XML(string);
	var result = {};
	return result;
},

// Deprecated
XMLBroker.prototype.parseJobsXML = function () {
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
},

// Deprecated
XMLBroker.prototype.encodeResponseXML = function(resp) {
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
};
