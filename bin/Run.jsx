/**
 * Это main() на стороне Иллюстратора
 */
(function() {
	/**
	 * Облом?
	 * Creative Suite должен быть 3 :(
	 */
	var versions = $.version.split('.');
	var major = parseInt(versions[0],10);
	if (major !== 3) {
		alert('Тут только под CS3, сорри...');
		return 'Несовместимая версия Creative Suite';
	}
	/**
	 * Если forever, то скрипт будет выполняться в бесконечном цикле;
	 * Если не forever, то только один раз;
	 *
	 * @var {boolean} 
	 */
	var forever = true;

	/**
	 * Интервал между запросами заданий (20 секунд)
	 *
	 * @var {number}
	 */
	var sleepFor = 20000;

	/**
	 * Подгрузка классов, объявление пространства имён Indigo;
	 */
	#include ../include/indigo.jsxinc

	/**
	 * Объединение config.json со значениями по умолчанию из Indigo.config
	 * 
	 * Если необходимы переопределения дефолтных настроек, можно скопировать
	 * файл config.json.example в $home/Application Data/Indigo/, переименовать
	 * его в config.json и раскомментировать значения, которые надо изменить;
	 */
	var configOverrides = $.getenv('appdata') + '/Indigo/config.json';
	if (File(configOverrides).exists) {
		var conf = $.evalFile(configOverrides);
		for (var prop in conf) {
			if (conf.hasOwnProperty(prop)) {
				Indigo.config[prop] = conf[prop];
			}
		};
	}

	/**
	 * Подгрузка webaccesslib.dll необходима для обмена данными по HTTP
	 * протоколу между estk и внешними источниками данных. Если Creative
	 * Suite установлен не в Programm Files, необходимо явно указать, где
	 * лежит webaccesslib.dll.
	 *
	 * Будет использован первый найденный webaccesslib из конфига Indigo
	 */
	var webaccesslib;
	for (var path_index in Indigo.config.webaccesslib) {
		var lib_file = new File(Indigo.config.webaccesslib[path_index]);
		if (lib_file.exists) {
			webaccesslib = new ExternalObject('lib:' + lib_file.fullName);
			break;
		}
	}

	/**
	 * Инстанцируем босса
	 */
	var c = new Indigo.Controller();

	/**
	 * Сохранение даты модификации indigo.jsxinc в контроллере
	 *
	 * Исходный код из indigo.jsxinc загружается ровно один раз, при старте;
	 * Если этот код изменился, а estk крутится в демоническом состоянии,
	 * то контроллер продолжит гонять старый код до тех пор, пока кто-нибудь 
	 * не придёт и не прекратит эту вакханалию.
	 * Поэтому перед входом в цикл мы сохраняем текущее время модификации  
	 * исходников, а в каждой итерации с ним сверяемся.
	 */
	var sourceCode = new File('../include/indigo.jsxinc');
	c.codeTimestamp = sourceCode.modified.getTime();

	/**
	 * Раз в 20 секунд -- АЛГА!!!
	 * Нет функции setInterval() в этой реализации JavaScript. 
	 * Поэтому do...sleep...while;
	 */
	do {
		c.run();
		$.sleep(sleepFor);
		// Выход из цикла, если дата изменения файла с исходниками 
		// отличается от даты на момент запуска
		if (c.codeTimestamp !== sourceCode.modified.getTime()) {
			break;
		}
	} while(forever);
	c.cleanup();
})();
