#target Illustrator-13

/*
 * Подключение тестируемого класса
 */

#include "mc.jsx"

/*
 * Главный класс для выполнения тестов
 * @app Adobe Illustrator Application object
 */
function testSuite(app) {
	this.app = app;
	this.testsFolder = 'tests\\';
};

testSuite.prototype = {
	execute: function(test) {
		test.setUp();
		test.run();
		test.tearDown();
	},
	runAllTests: function() {
		for (var i=0, l = this.tests.length; i < l; i++) {
			var className = this.tests[i];
			/*
			 * TODO: Как избавиться от eval?
			 */
			test = eval('new ' + className);
			this.execute(test);
		};
	},
	setUp: function() {},
	assertInstanceOf: function (assertOn, assertTo) {
		return (assertOn instanceof assertTo) ? 'pass: ' : 'fail: ';
	},
	tearDown: function() {
		var ill = this.app;
		ill.activeDocument.close(SaveOptions.DONOTSAVECHANGES);
	},
	assertEq: function (assertOn, assertTo) {
		return (assertOn === assertTo ) ? 'pass: ' : 'fail: ';
	},
};

/*
 * Start here
 *

 *
 * Подключение тестов
 * Важно подключать ПОСЛЕ инициализации главного тестирующего класса
 * Соглашение:
 *   все тесты лежат в подпапке tests 
 *   начинаются с test
 *   и имеют расширение .jsxinc
 * Пример:
 *   testOpenTemplate.jsxinc
 */

testsFolder = new Folder('tests');
testsFiles = testsFolder.getFiles('test*.jsxinc');
testNames = [];
/*
 * Итерация по массиву с кэшированием длины
 * http://shamansir.github.io/JavaScript-Garden/#array.general
 */
for (var i=0, l = testsFiles.length; i < l; i++) {
	var testFileName = testsFiles[i].name;
	$.evalFile(testsFolder + '\\' + testFileName);
	var testName = testFileName.replace('.jsxinc','');
	testNames.push(testName);
}

ts = new testSuite(app);
ts.tests = testNames;
// Запустить все тесты...
ts.runAllTests();

// ...или запустить один тест:
//test = new testGetLabels();
//ts.execute(test);
