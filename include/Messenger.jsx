/**
 * @classdesc Суперкласс для обмена сообщениями между
 * Иллюстратором и фронтэндом.
 * Фронтенд может быть любой: веб-сервер, Adobe UI или 
 * просто логгер в текстовый файл.
 *
 * @constructor
 */
Indigo.Messenger = function() {};

/**
 * @abstract
 */
Indigo.Messenger.prototype.setup = function() {
},

/**
 * @abstract
 */
Indigo.Messenger.prototype.send = function(message) {
};

/**
 * @abstract
 */
Indigo.Messenger.prototype.receive = function() {
};
