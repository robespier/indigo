/**
 * @classdesc Реализация обмена данными в формате json 
 * для Adobe CS3
 * @constructor
 */
Indigo.JsonBroker = function() {};

Indigo.JsonBroker.prototype = new Indigo.DataBroker();
Indigo.JsonBroker.prototype.constructor = Indigo.JsonBroker;
Indigo.JsonBroker.prototype.type = 'json';

/**
 * Реализация интерфейса Indigo.DataBroker 
 */
Indigo.JsonBroker.prototype.encode = function (obj) {
	return this.toJSON(obj);
},

/**
 * Реализация интерфейса Indigo.DataBroker 
 */
Indigo.JsonBroker.prototype.decode = function (string) {
	return this.fromJSON(string);
},

/**
 * Сериализация объекта Adobe JavaScript CS3 в формат JSON, понятный остальным 
 *
 * @param {object} obj Объект под сериализацию
 * @return {string} parcel Валидный json
 */
Indigo.JsonBroker.prototype.toJSON = function (obj) {
	this.saveObj(obj);
	var jsonString = '';
	var parcel = '{' + this.json_encode(obj, jsonString) + '}';
	return parcel;
},

/**
 * @desc Восстановление объекта JavaScipt из json-строки. 
 *
 * @param {string} string Сериализованный объект
 * @return {object} obj Объект JavaScript
 */
Indigo.JsonBroker.prototype.fromJSON = function(string) {
	try {
		var obj = eval( '(' + string + ')' );
		return this.json_decode(obj);
	} catch (e) {
		this.saveString(string);
	}
},

/**
 * Protected functions
 */

Indigo.JsonBroker.prototype.json_decode = function(obj) {
	for (var key in obj) {
		if (obj.hasOwnProperty(key)) {
			if (typeof(obj[key]) === 'string') {
				obj[key] = decodeURIComponent(obj[key]);
			}
			if (typeof(obj[key]) === 'object') {
				obj[key] = this.json_decode(obj[key]);
			}
		}
	}
	return obj;
},

/**
 * Преобразование объекта в json формат. 
 * Рекурсивно обходит свойства объекта и хлопает их в строку.
 *
 * Херовая реализация, первый кандидат на рефакторинг
 *
 * @param {object} obj Объект сериализации
 * @param {string} jsonString Накопительная переменная для хранения промежуточных результатов 
 * @return {string} js Строка json
 */
Indigo.JsonBroker.prototype.json_encode = function(obj, jsonString) {
	for(var i in obj) {
		if (obj.hasOwnProperty(i)) {
			var Pocient = obj[i];
			if (Pocient instanceof Array) {
				jsonString += '"' + i + '":' + '[' + this.json_encode(Pocient, '') + '],';
				continue;
			}
			if (typeof(Pocient) === "number") {
				jsonString += '"' + i + '":' + Pocient + ',';
				continue;
			}
			if (Pocient instanceof Object) {
				jsonString += '"' + i + '":' + '{' + this.json_encode(Pocient, '') + '},';
				continue;
			}
			if (typeof(Pocient) === 'boolean') {
				var jsonBool = Pocient ? "true" : "false";
				jsonString += '"' + i + '":' + jsonBool + ',';
			} else {
				// Будем считать, что это string
				// Напрааа-во!
				// (Повернуть все слэши в "нужную" сторону, чтоб не париться на стороне сервера)
				var slashString = Pocient.replace(/\\/g,'/');
				//
				var cleanString = slashString.toSource().replace('(new String(','').replace('))','');
				if (obj instanceof Array) {
					// Числовые индексы массива нам тут нахрен не нужны
					jsonString += cleanString + ',';
				} else {
					// А вот имена свойств объектов или переменных -- всегда пожалуйста
					jsonString += '"' + i + '":' + cleanString + ',';
				}
				continue;
			}
		}
	}
	// remove last comma
	var b = jsonString.lastIndexOf(',');
	var js = jsonString.substr(0,b);
	
	return js;
};
