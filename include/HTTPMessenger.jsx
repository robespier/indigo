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
Indigo.HTTPMessenger.prototype.remote = Indigo.config.webserver;

/**
 * @protected
 */
Indigo.HTTPMessenger.prototype.getConnection = function() {
};

/**
 * @param {string} type 
 * @param {objects} data JavaScript object
 */
Indigo.HTTPMessenger.prototype.receive = function(type, data) {
	var result = null;
	switch(type) {
		case "fetchJobs":
			result = this.fetchJobs();
		break;
	}
	return result;
};

Indigo.HTTPMessenger.prototype.send = function(type, data) {
	data.path = type;
	this.post(data);
};

/**
 * POST на сервер
 * @todo соединение не закрывать, кипалайв возможен
 * @protected
 */
Indigo.HTTPMessenger.prototype.post = function(message) {
	var httpPath = this.remote + this.dataBroker.getURI() + message.path;
	var http = new HttpConnection(httpPath);
	delete message.path;
	if (message.async) {
		http.async = true;
	}
	var parcel = this.dataBroker.encode(message);
	http.mime = "application/x-www-form-urlencoded";
	http.requestheaders = ["User-Agent", "Indigo 1.0"];
	http.request = 'parcel=' + parcel;
	http.method = "POST";
	http.execute();
	http.close();
};

/**
 * GET на сервер
 * @todo соединение не закрывать, кипалайв возможен
 * @protected
 */
Indigo.HTTPMessenger.prototype.get = function(from) {
	var url = encodeURI(from);
	var http = new HttpConnection(url);
	http.requestheaders = ["User-Agent", "Indigo 1.0"];
	http.execute();
	var response = http.response;
	http.close();
	return response;
};

/**
 * Parse jobs from remote source to JavaScript job object
 *
 * @protected
 * @return {array} data Array of Job objects
 */
Indigo.HTTPMessenger.prototype.fetchJobs = function() {
	var from = this.remote + this.dataBroker.getURI() + 'fetchJobs';
	var response = this.get(from);
	var data = this.dataBroker.decode(response);
	return data;
};
