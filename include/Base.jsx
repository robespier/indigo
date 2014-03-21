///#target Illustrator-13

/**
 * В Indigo собран код, работающий под управлением
 * Adobe Bridge или Adobe Extended Script Tool Kit
 * @namespace 
 */
var Indigo = Indigo || {

	/**
	 * @constant {number} CYAN 
	 * @memberof Indigo
	 */
	CYAN : 32,

	/**
	 * @constant {number} MAGENTA 
	 * @memberof Indigo
	 */
	MAGENTA : 16,

	/**
	 * @constant {number} YELLOW 
	 * @memberof Indigo
	 */
	YELLOW : 8,

	/**
	 * @constant {number} BLACK
	 * @memberof Indigo
	 */
	BLACK : 4,

	/**
	 * Объект для хранения конфигурации приложения
	 * @memberof Indigo
	 */
	config : {
		blankFile : 'D:/tmp/blank.ai',
		webaccesslib: 'D:/bin/Adobe/Adobe Bridge CS3/webaccesslib.dll',
		webserver : 'http://indigo.aicdr.pro:8080/'
	}
};
