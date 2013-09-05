/**
 * @classdesc Суперкласс для обмена данными между 
 * Adobe Bridge/ESTK и внешним контроллером
 * @constructor
 */
Indigo.DataBroker = function() {};

/**
 * @prop {string} tempPath 
 * @protected
 */
Indigo.DataBroker.prototype.tempPath = '/w/tmp/';

/**
 * @prop {string} httpPart Адрес роутера в http запросе
 */
Indigo.DataBroker.prototype.httpPart = 'getJobs/';

/**
 * Сериализация объекта в согласованный формат
 *
 * @abstract
 * @param {object}
 * @return {string}
 */
Indigo.DataBroker.prototype.encode = function(obj) {
	return 'This method must be overloaded in subclass';
},

/**
 * Реконструкция объекта из строки
 *
 * @abstract
 * @param {string}
 * @return {object}
 */
Indigo.DataBroker.prototype.decode = function(string) {
	return 'This method must be overloaded in subclass';
},

/**
 * Относительный адрес, куда брокер отправляет запросы
 *
 * @return {string} URI
 */
Indigo.DataBroker.prototype.getURI = function() {
	return this.httpPart + this.type + "/";
},

/**
 * Сохранение объекта в файл
 *
 * @param {object} obj Объект для сохранения
 * @protected
 * @return {void}
 */
Indigo.DataBroker.prototype.saveObj = function(obj) {
	var jobFile = new File(this.tempPath + this.type + 'Obj.txt');
	jobFile.open('w');
	jobFile.write (obj.toSource());
	jobFile.close();
},

/**
 * Сохранение строки в файл
 *
 * @param {string} string 
 * @protected
 * @return {void}
 */
Indigo.DataBroker.prototype.saveString = function(string) {
	var jobFile = new File(this.tempPath + this.type + 'String.txt');
	jobFile.open('w');
	jobFile.write (string);
	jobFile.close();
},

/**
 * Загрузка строки из файла
 *
 * @protected
 * @return {string}
 */
Indigo.DataBroker.prototype.loadJob = function() {
	var jobFile = new File(this.tempPath + this.type + 'String.txt');
	jobFile.open('r');
	var jobSource = jobFile.read();
	jobFile.close();
	return jobSource;
};
