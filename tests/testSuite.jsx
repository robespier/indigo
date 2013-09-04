var Indigo = Indigo || {};
/**
 * Тесты будут жить в своём углу
 * @namespace
 */
Indigo.Tests = Indigo.Tests || {};

///#target Illustrator-13

/** Подключение тестируемого кода */
///#include "../include/indigo-nodejs.jsxinc"

/**
 * Главный класс для выполнения тестов
 *
 * @prop {Applicatin} app Illustrator Application object
 * @prop {Folder} testsFolder Место в файловой системе, где тесты живут
 * @prop {array} testNames Массив имён всех доступных тестов
 * @prop {object} pocient Тестируемый класс
 * @constructor
 * @param {Application} app Illustrator Application object
 */
Indigo.Tests.testSuite = function(app) {
	this.app = app;
	this.testsFolder = new Folder('/w/tests/');
	this.testsNames = [];
};

Indigo.Tests.testSuite.prototype = {
	/**
	 * Сборка всех файлов тестов в кучу. 
	 * Набиваем массив this.testsNames именами тестов
	 *
	 * @private
	 */
	init: function() {
		this.testsNames = [];
		var testsFiles = this.testsFolder.getFiles('test*.jsxinc');
		for (var i=0, l = testsFiles.length; i < l; i++) {
			var testFileName = testsFiles[i].name;
			// Теперь этим занимается Grunt:
			// $.evalFile(this.testsFolder + '\\' + testFileName);
			var testName = testFileName.replace('.jsxinc','');
			this.testsNames.push(testName);
		}
	},

	/**
	 * Выполнение теста по кентбэковски
	 *
	 * @param {object} test Тест
	 */
	execute: function(test) {
		test.setUp();
		test.run();
		test.tearDown();
	},

	/**
	 * Запуск всех тестов, которые только есть 
	 */
	runAllTests: function() {
		for (var i=0, l = this.testsNames.length; i < l; i++) {
			var className = this.testsNames[i];
			/*
			 * TODO: Как избавиться от eval?
			 */
			var test = eval('new Indigo.Tests.' + className);
			this.execute(test);
		}
		return 'AllTests done';
	},

	/**
	 * @abstract
	 */
	setUp: function() {
		// Задание по умолчанию
		this.job = {
			"template" : '123321',
			"hot_folder:" : 'CMYK',
			"roll_number" : '2',
		};
	},

	/**
	 * @abstract
	 */
	tearDown: function() {
		var ill = this.app;
		ill.activeDocument.close(SaveOptions.DONOTSAVECHANGES);
	},

	/**
	 * Логгирование результатов теста
	 *
	 * @param {string} result Результат теста (pass|fail)
	 * @param {string} message Дополнительная информация
	 */
	log: function(result, message) {
		$.writeln(result + this.name + message);
	},

	/**
	 * Assertions
	 */
	
	/**
	 * Проверка, является ли объект assertOn экземпляром класса assertTo
	 *
	 * @param {object} assertOn
	 * @param {object} assertTo
	 * @return {string} (pass|fail)
	 */
	assertInstanceOf: function (assertOn, assertTo) {
		return (assertOn instanceof assertTo) ? 'pass: ' : 'fail: ';
	},

	/**
	 * Сравнение двух величин
	 *
	 * @param {object} assertOn
	 * @param {object} assertTo
	 * @return {string} (pass|fail)
	 */
	assertEq: function (assertOn, assertTo) {
		return (assertOn === assertTo ) ? 'pass: ' : 'fail: ';
	},

	/**
	 * Проверка существования файла в файловой системе
	 *
	 * @param {string} fileFullPath Полный путь к файлу
	 * @return {string} (pass|fail)
	 */
	assertFileExists : function (fileFullPath) {
		var assertFile = new File(fileFullPath);
		return (assertFile.exists) ? 'pass: ' : 'fail: ';
	},
};
