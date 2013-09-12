/**
 * @constructor
 */
Indigo.Controller = function() {
	this.setup();
};

Indigo.Controller.prototype.setup = function() {
	this.remote = "http://indigo.aicdr.pro/";
	this.dataBroker = new Indigo.JsonBroker();
	this.allowedMethods = ['parseJobs'];
};

/**
 * @todo Добавить таки проверку
 */
Indigo.Controller.prototype.isMethodAllowed = function(code) {
	return true;
};

/**
 * Get Jobs Array from remote
 * @param form string Url
 */
Indigo.Controller.prototype.pullJobs = function(from) {
	var url = encodeURI(from);
	var http = new HttpConnection(url);
	http.requestheaders = ["User-Agent", "Indigo 1.0"];
	http.execute();
	return http.response;
};

/**
 * Post Results To Remote 
 *
 * @param {string} data Encoded JavaScript object
 */
Indigo.Controller.prototype.postMessage = function(data) {
	var http = new HttpConnection(this.remote);	
	//var parcel = "resp=" + data;
	var parcel = "XDEBUG_SESSION_START=netbeans-xdebug" + "&" + "resp=" + data;  
	http.mime =  "application/x-www-form-urlencoded";
	http.requestheaders = ["User-Agent", "Indigo 1.0"];
	http.request = parcel;
	http.method = "POST";
	http.execute();
};

Indigo.Controller.prototype.postResponse = function(message) {
	$.writeln('Controller onResult() Here');
	return message;
	/*var resp = encodeResponse(eval(message.body));
	$.writeln(resp.toString());
	postMessage(resp.toString());*/
};	

/**
 * Parse jobs source to JavaScript job object
 *
 * @return {array} data Array of Job objects
 */
Indigo.Controller.prototype.parseJobs = function() {
	var from = this.remote + this.dataBroker.getURI();
	var response = this.pullJobs(from);
	var data = this.dataBroker.decode(response);
	if (typeof(AsyncDebug) !== "undefined") {
		this.dataBroker.saveString(response);
	}
	return data;
};

Indigo.Controller.prototype.encodeResponse = function(resp) {
	var data = this.dataBroker.encode(resp);
	return data;
};

Indigo.Controller.prototype.run = function() {
};
