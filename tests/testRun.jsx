/*
 * Start here
 *
 * Подключение тестов
 * Важно подключать ПОСЛЕ инициализации главного тестирующего класса
 * Соглашение:
 *   все тесты лежат в подпапке tests 
 *   имя файла с тестом начинается с test
 *   и имеет расширение .jsxinc
 * Пример:
 *   testOpenTemplate.jsxinc
 */

/**
 * Сброс статистики покрытия кода, если есть.
 *
 * Объект _$jscoverage в глобальной видимости создаёт blanket в процессе 
 * инструментировании кода. _$jscoverage сохраняет своё состояние между 
 * запусками тестов, поэтому его желательно сбрасывать. JSHint на подобные 
 * махинации с глобальными объектами смотрит косо, поэтому говорим ему W020
 */
if (typeof(_$jscoverage) !== 'undefined') {
	/*jshint -W020*/
	_$jscoverage = undefined;
}

/** Подключение тестируемого кода */
///#include "../include/indigo.jsxinc"

var webaccesslib;
// Будет использован первый найденный webaccesslib из конфига indigo
for (var path_index in Indigo.config.webaccesslib) {
	var lib_file = new File(Indigo.config.webaccesslib[path_index]);
	if (lib_file.exists) {
		webaccesslib = new ExternalObject('lib:' + lib_file.fullName);
		break;
	}
}


Indigo.Tests.ts = new Indigo.Tests.testSuite(app);
Indigo.Tests.ts.reporter = new Indigo.Tests.HtmlReporter();
Indigo.Tests.ts.init();
// Запустить все тесты...
Indigo.Tests.ts.runAllTests();

// ...или запустить один тест:
//Indigo.Tests.ts.execute(new Indigo.Tests.testHTTPMessenger());
