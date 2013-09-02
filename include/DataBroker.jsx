function dataBroker() {}

//dataBroker.prototype.constructor = dataBroker;

dataBroker.prototype.getURI = function() {
	return "getJobs/" + this.type + "/";
},

dataBroker.prototype._saveJob = function(job) {
	var jobFile = new File('/w/tmp/' + this.type + 'Job.txt');
	jobFile.open('w');
	jobFile.write (job.toSource());
	jobFile.close();
},

dataBroker.prototype._saveString = function(string) {
	var jobFile = new File('/w/tmp/' + this.type + 'String.txt');
	jobFile.open('w');
	jobFile.write (string);
	jobFile.close();
},

dataBroker.prototype._loadJob = function() {
	var jobFile = new File('/w/tmp/' + this.type + 'String.txt');
	jobFile.open('r');
	var jobSource = jobFile.read();
	jobFile.close();
	return jobSource;
},

dataBroker.prototype._createStub = function() {
	var job1 = {
		template: '4({5)0005',
		print_list : ['111','222','333'],
		roll: 2,
		hot_folder: 'CMYK',
	};
	var job2 = {
		template: '450006',
		print_list : ['555','444 ziht','5 55 йщ'],
		roll: 2,
		hot_folder: 'CMYKW',
	};

	var job = [ job1, job2 ];
	return job;
};
