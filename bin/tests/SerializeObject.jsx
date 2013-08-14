function saveJob(job) {
	var jobFile = new File('/w/tmp/job.txt');
	jobFile.open('w');
	jobFile.write (job.toSource());
	jobFile.close();
}

function loadJob() {
	var jobFile = new File('/w/tmp/job.txt');
	jobFile.open('r');
	var jobSource = jobFile.read();
	jobFile.close();
	return jobSource;
}

var job = {
	template: '450005',
	roll: 2,
	hot_folder: 'CMYK',
	print_list : ['111','222','333'],
};

//saveJob(job);
var jobStr = loadJob();
var newJob = eval(jobStr);

// Bridge Function
var newJob2 = $.evalFile('/w/tmp/job.txt');

var test = newJob.roll;
var test2 = newJob2.roll;