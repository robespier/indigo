#target illustrator-13.0

var webaccesslib = new ExternalObject("lib:D:/bin/Adobe/Adobe Bridge CS3/webaccesslib.dll");

var doc = app.activeDocument;

var getJobs = 'http://indigo.aicdr.pro/getJobs/json/';

	var http = new HttpConnection(getJobs);
	http.requestheaders = ["User-Agent", "Indigo 1.0"];
	http.execute();
	var jobs = http.response;
	
	var j = jobs;
