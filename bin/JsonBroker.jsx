#include "DataBroker.jsx"

function jsonBroker() {}

jsonBroker.prototype = new dataBroker();
jsonBroker.prototype.constructor = jsonBroker;
jsonBroker.prototype.type = 'json';

/**
 * Interface realization
 */

jsonBroker.prototype.encode = function (obj) {
	return this.toJSON(obj);
},

jsonBroker.prototype.decode = function (string) {
	return this.fromJSON(string);
},

/**
 * Сериализация объекта Adobe JavaScript CS3 в формат JSON, понятный PHP 5.3
 */
jsonBroker.prototype.toJSON = function (obj) {
	var jsonString = '';
	var parcel = '[' + this._json_encode(job, jsonString) + ']';
	return parcel;
},

/**
 * Восстановление объекта JavaScipt из json-строки;
 *
 * Вот тут у нас НЕХИЛАЯ БРЕШЬ В БЕЗОПАСНОСТИ. Фактически, с удалённого сервера
 * присылается некий код, который выполняется на локальной машине с правами
 * пользователя.
 *
 * То есть, какой-нибудь поц может подменить адрес сервера с помощью, например,
 * DNS-спуффинга и в ответ на запрос заданий прислать зловредный javascript.
 * Например var f = new Folder(myDocuments); f.remove();
 * Учитывая то, что реализация JavaScript от Adobe имеет полный доступ к
 * файловой системе -- последствия могут быть очень и очень печальными.
 *
 * XML в этом смысле понадёжней будет.
 */
jsonBroker.prototype.fromJSON = function(string) {
	try {
		obj = eval(string);
		return obj;
	} catch (e) {
		$.writeln('json_decode failed: ' + e.message);
		this._saveString(string);
	}
},

/**
 * Protected functins
 */

/**
 * Преобразование объекта в json формат
 *
 * Херовая реализация, первый кандидат на рефакторинг
 */
jsonBroker.prototype._json_encode = function(obj, jsonString) {
	for(var i in obj) {
		if (obj.hasOwnProperty(i)) {
			var Pocient = obj[i];
			if (Pocient instanceof Array) {
				jsonString += '"' + i + '":' + Pocient.toSource() + ',';
				//$.write('"' + i + '":' + Pocient.toSource());
				continue;
			}
			if (typeof(Pocient) === "number") {
				jsonString += '"' + i + '":' + Pocient + ',';
				continue;
			}
			if (Pocient instanceof Object) {
				selfSource = '';
				jsonString += '{' + this._json_encode(Pocient, selfSource) + '},';
				
			} else {
				var cleanString = Pocient.toSource().replace('(new String(','').replace('))','');
				jsonString += '"' + i + '":' + cleanString + ',';
				//$.write('"' + i + '":' + cleanString + ',');
				continue;
			}
		}
	}
	// remove last comma
	var b = jsonString.lastIndexOf(',');
	var c = jsonString.substr(0,b);
	
	return c;
},

jsonBroker.prototype.test = function() {
	var job = this._createStub();
	var parcel = this.toJSON(job);
	$.writeln();
	$.writeln(parcel);
	
	//this.saveJob(job);
	//var jobStr = this.loadJob();
	//var newJob = eval(jobStr);

	// Bridge Function
	//var newJob2 = $.evalFile('/w/tmp/job.txt');
	//var newJob2 = $.evalFile('/w/bin/tests/phpJSON.txt');

	//var test = newJob.roll;
	//var test2 = newJob2.roll;
};
