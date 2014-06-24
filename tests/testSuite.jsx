var Indigo = Indigo || {};

var webaccesslib;
// Будет использован первый найденный webaccesslib из конфига indigo
for (var path_index in Indigo.config.webaccesslib) {
	var lib_file = new File(Indigo.config.webaccesslib[path_index]);
	if (lib_file.exists) {
		webaccesslib = new ExternalObject('lib:' + lib_file.fullName);
		break;
	}
}

/**
 * Тесты будут жить в своём углу
 * @namespace
 */
Indigo.Tests = Indigo.Tests || {

	/**
	 * @constant {string} PASS
	 * @memberof Indigo.Tests
	 */
	PASS: 'pass: ',

	/**
	 * @constant {string} FAIL 
	 * @memberof Indigo.Tests
	 */
	FAIL: 'fail: ',
};

/**
 * Главный класс для выполнения тестов
 *
 * @prop {Applicatin} app Illustrator Application object
 * @prop {string} testsFolder Место в файловой системе, где тесты живут
 * @prop {string} testsFilesFolder Место, где хранятся графические файлы для тестов
 * @prop {array} testNames Массив имён всех доступных тестов
 * @prop {object} pocient Тестируемый класс
 * @constructor
 * @param {Application} app Illustrator Application object
 */
Indigo.Tests.testSuite = function(app) {
	this.app = app;
	this.testsFolder = '/w/tests/';
	this.testsFilesFolder = '/d/tmp/tests-indigo/';
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
		var testsSources = new Folder(this.testsFolder);
		var testsFiles = testsSources.getFiles('test*.jsxinc');
		for (var i=0, l = testsFiles.length; i < l; i++) {
			var testFileName = testsFiles[i].name;
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
			var test = new Indigo.Tests[className]();
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
	 *
	 */
	getMockJob: function() {
		this.testCommonPath = 'testCommons/d9/111/';
		Indigo.config.HFRoot =  this.testsFilesFolder + 'testCommons/' + 'RIP/';
		var job = {
			"cut_number" : this.name,
			"hot_folder" : 'CMYK',
			"roll" : '2',
			"label_path" : [
				this.testsFilesFolder + this.testCommonPath + '001/spaklevka_08_klei.eps',
				this.testsFilesFolder + this.testCommonPath + '002/spaklevka_1_5_klei.eps',
			].join('\n'),
		};
		return job;
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
		return (typeof(obj) === 'undefined') ? Indigo.Tests.PASS : Indigo.Tests.FAIL;
	},

	/**
	 * Проверка, является ли объект assertOn экземпляром класса assertTo
	 *
	 * @param {object} assertOn
	 * @param {object} assertTo
	 * @return {string} (pass|fail)
	 */
	assertInstanceOf: function (assertOn, assertTo) {
		return (assertOn instanceof assertTo) ? Indigo.Tests.PASS : Indigo.Tests.FAIL;
	},

	/**
	 * Сравнение двух величин
	 *
	 * @param {object} assertOn
	 * @param {object} assertTo
	 * @return {string} (pass|fail)
	 */
	assertEq: function (assertOn, assertTo) {
		return (assertOn === assertTo ) ? Indigo.Tests.PASS : Indigo.Tests.FAIL;
	},

	/**
	 * Проверка существования файла в файловой системе
	 *
	 * @param {string} fileFullPath Полный путь к файлу
	 * @return {string} (pass|fail)
	 */
	assertFileExists : function (fileFullPath) {
		var assertFile = new File(fileFullPath);
		return (assertFile.exists) ? Indigo.Tests.PASS : Indigo.Tests.FAIL;
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
		return (this.deepCompare(assertOn, assertTo)) ? Indigo.Tests.PASS : Indigo.Tests.FAIL; 
	},

	/**
	 * Совершенно бессовестно (и бездумно) украдено отсюда:
	 * @see http://stackoverflow.com/questions/1068834/object-comparison-in-javascript
	 * @todo Что всё таки этот метод делает?
	 * @todo Lo-Dash
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
