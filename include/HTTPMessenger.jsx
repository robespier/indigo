/**
 * @classdesc Обмен сообщениями по протоколу HTTP между Иллюстратором 
 * и неким web-сервером
 *
 * @constructor
 */
Indigo.HTTPMessenger = function(dataBroker) {
	this.dataBroker = dataBroker;
};

Indigo.HTTPMessenger.prototype = new Indigo.Messenger();
Indigo.HTTPMessenger.prototype.constructor = Indigo.HTTPMessenger;

/**
 * @prop {string} remote Адрес Web-сервера
 */
Indigo.HTTPMessenger.prototype.remote = "http://indigo.aicdr.pro/";

/**
 * @protected
 */
Indigo.HTTPMessenger.prototype.getConnection = function() {
};

/**
 * POST на сервер
 */
Indigo.HTTPMessenger.prototype.send = function(message) {
	var http = new HttpConnection(this.remote);	
	//var parcel = "resp=" + data;
	var parcel = "XDEBUG_SESSION_START=netbeans-xdebug" + "&" + "resp=" + message;
	http.mime = "application/x-www-form-urlencoded";
	http.requestheaders = ["User-Agent", "Indigo 1.0"];
	http.request = parcel;
	http.method = "POST";
	http.execute();
};

/**
 * GET на сервер
 */
Indigo.HTTPMessenger.prototype.receive = function(from) {
	var url = encodeURI(from);
	var http = new HttpConnection(url);
	http.requestheaders = ["User-Agent", "Indigo 1.0"];
	http.execute();
	return http.response;
};

/**
 * Parse jobs from remote source to JavaScript job object
 *
 * @return {array} data Array of Job objects
 */
Indigo.HTTPMessenger.prototype.fetchJobs = function() {
	var from = this.remote + this.dataBroker.getURI();
	var response = this.receive(from);
	var data = this.dataBroker.decode(response);
	if (typeof(Indigo_UnitTests) !== "undefined") {
		this.dataBroker.saveString(response);
	}
	return data;
};
