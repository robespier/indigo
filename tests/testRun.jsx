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

/** Подключение тестируемого кода */
///#include "../include/indigo.jsxinc"

Indigo.Tests.ts = new Indigo.Tests.testSuite(app);
Indigo.Tests.ts.reporter = new Indigo.Tests.HtmlReporter();
Indigo.Tests.ts.init();
// Запустить все тесты...
Indigo.Tests.ts.runAllTests();

// ...или запустить один тест:
//Indigo.Tests.ts.execute(new Indigo.Tests.testHTTPMessenger());
