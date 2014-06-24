///#target Illustrator-13

/**
 * В Indigo собран код, работающий под управлением  
 * Adobe Extended Script Tool Kit (`estk`)
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
		achtungFile: 'Y:/ACHTUNG.eps',
		webaccesslib: [
			'C:/Program Files (x86)/Adobe/Adobe Bridge CS3/webaccesslib.dll',
			'D:/bin/Adobe/Adobe Bridge CS3/webaccesslib.dll'
		],
		webserver : 'http://indigo.aicdr.pro:8080/',
		// Корень хотфолдеров
		HFRoot : 'X:/',
		// Корень шаблонов
		TmplRoot : 'D:/work/template',
	}
};
