var Indigo = Indigo || {};
/**
 * Тесты будут жить в своём углу
 * @namespace
 */
Indigo.Tests = Indigo.Tests || {};

///#target Illustrator-13

/** Подключение тестируемого кода */
///#include "../include/indigo-ill.jsxinc"
///#include "../include/indigo-utils.jsxinc"

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
	
	assertUndefined: function (obj) {
		return (obj === undefined) ? 'pass: ' : 'fail: ';
	},

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

	/**
	 * Сравнение двух объектов.
	 * Для тех случаев, когда объекты идентичны, но 
	 * obj1 === obj2 is false, т.к. это разные инстансы;
	 *
	 * @param {object} assertOn 
	 * @param {object} assertTo
	 * @return {string} (pass|fail)
	 */
	assertObjectsSame : function (assertOn, assertTo) {
		return (this.deepCompare(assertOn, assertTo)) ? 'pass: ' : 'fail: '; 
	},

	/**
	 * Совершенно бессовестно (и бездумно) украдено отсюда:
	 * @see http://stackoverflow.com/questions/1068834/object-comparison-in-javascript
	 * @todo Что всё таки этот метод делает?
	 *
	 * @protected
	 * @return {boolean}
	 */
	deepCompare: function () {
		var leftChain, rightChain;

		function compare2Objects (x, y) {
			var p;

			// remember that NaN === NaN returns false
			// and isNaN(undefined) returns true
			if (isNaN(x) && isNaN(y) && typeof x === 'number' && typeof y === 'number') {
				return true;
			}

			// Compare primitives and functions.     
			// Check if both arguments link to the same object.
			// Especially useful on step when comparing prototypes
			if (x === y) {
				return true;
			}

			// Works in case when functions are created in constructor.
			// Comparing dates is a common scenario. Another built-ins?
			// We can even handle functions passed across iframes
			if ((typeof x === 'function' && typeof y === 'function') ||
					(x instanceof Date && y instanceof Date) ||
					(x instanceof RegExp && y instanceof RegExp) ||
					(x instanceof String && y instanceof String) ||
					(x instanceof Number && y instanceof Number)) {
						return x.toString() === y.toString();
					}

			// At last checking prototypes as good a we can
			if (!(x instanceof Object && y instanceof Object)) {
				return false;
			}

			if (x.isPrototypeOf(y) || y.isPrototypeOf(x)) {
				return false;
			}

			if (x.constructor !== y.constructor) {
				return false;
			}

			if (x.prototype !== y.prototype) {
				return false;
			}

			// check for infinitive linking loops
			// в Adobe JavaScript CS3 нет метода Array.indexOf
			//if (leftChain.indexOf(x) > -1 || rightChain.indexOf(y) > -1) {
			//	return false;
			//}

			// Quick checking of one object beeing a subset of another.
			// todo: cache the structure of arguments[0] for performance
			for (p in y) {
				if (y.hasOwnProperty(p) !== x.hasOwnProperty(p)) {
					return false;
				}
				else if (typeof y[p] !== typeof x[p]) {
					return false;
				}
			}

			for (p in x) {
				if (y.hasOwnProperty(p) !== x.hasOwnProperty(p)) {
					return false;
				}
				else if (typeof y[p] !== typeof x[p]) {
					return false;
				}

				switch (typeof (x[p])) {
					case 'object':
					case 'function':

						leftChain.push(x);
						rightChain.push(y);

						if (!compare2Objects (x[p], y[p])) {
							return false;
						}

						leftChain.pop();
						rightChain.pop();
						break;

					default:
						if (x[p] !== y[p]) {
							return false;
						}
						break;
				}
			}

			return true;
		}

		if (arguments.length < 1) {
			return true; //Die silently? Don't know how to handle such case, please help...
			// throw "Need two or more arguments to compare";
		}

		for (var i = 1, l = arguments.length; i < l; i++) {

			leftChain = []; //todo: this can be cached
			rightChain = [];

			if (!compare2Objects(arguments[0], arguments[i])) {
				return false;
			}
		}

		return true;
	}
};
