(function() {
	var indigoControllers = angular.module('indigoControllers', ['indigoDatasource']);
	indigoControllers.controller('OrderBlank', ['$scope', 'Blank', function($scope, Blank) {
		/**
		 * Загрузка данных бланка откуда-нибудь
		 * _id на шару, нода сейчас отвечает единственным набором данных
		 */
		$scope.order = Blank.get({_id:'example'});
		/**
		 * Get image of roll direction
		 *
		 * @param {string} direction Predefined direction
		 * @returns {string} img Icon relative filename
		 */
		$scope.getRollImage = function(direction) {
			var dirMap = {
				head_mashine: 'roll_1_6',
				foot_mashine: 'roll_2_5',
				foot_forward: 'roll_3_7',
				head_forward: 'roll_4_8',
			};
			var img = 'roll_undefinded';

			if (dirMap[direction]) {
				img = dirMap[direction];
			}
			return img + '.png';
		};

		/**
		 * Set roll image from click on rolls radio group
		 *
		 * @param {string} direction Predefined direction
		 */
		$scope.setRollImage = function(direction) {
			this.order.roll_dir = direction;
		};
	}]);

	indigoControllers.controller('JobBlank', ['$scope', '$location', 'Job', 'Blank', function($scope, $location, Job, Blank) {

		/**
		 * Значения по умолчанию
		 */
		$scope.workset = {
			roll: 'hand',
			roll_type: 'outside',
			roll_dir: 'head_forward',
			inks: [ 
				{ name: 'Opaque', used: false },
				{ name: 'Cyan', used: true },
				{ name: 'Magenta', used: true },
				{ name: 'Yellow', used: true },
				{ name: 'Black', used: true },
				{ name: 'Orange', used: false },
				{ name: 'Violet', used: false },
			],
			hot_folder: 'CMYK',
			actions: [
				{ name: 'AssemblyImposer', process: true },
				{ name: 'MatchingImposer', process: true },
				{ name: 'AchtungImposer', process: true },
			],
		};
		
		/**
		 * Загрузка данных бланка откуда-нибудь
		 * _id на шару, нода сейчас отвечает единственным набором данных
		 */
		$scope.order = Blank.get({_id:'example'});

		/**
		 * Get image of roll direction
		 *
		 * @param {string} direction Predefined direction
		 * @returns {string} img Icon relative filename
		 */
		$scope.getRollImage = function(direction) {
			var dirMap = {
				head_mashine: 'roll_1_6',
				foot_mashine: 'roll_2_5',
				foot_forward: 'roll_3_7',
				head_forward: 'roll_4_8',
			};
			var img = 'roll_undefinded';

			if (dirMap[direction]) {
				img = dirMap[direction];
			}
			return img + '.png';
		};

		/**
		 * Set roll image from click on rolls radio group
		 *
		 * @param {string} direction Predefined direction
		 */
		$scope.setRollImage = function(direction) {
			this.order.roll_dir = direction;
		};

		$scope.submit = function() {
			Job.push({parcel: angular.toJson($scope.workset)});
			$location.path('/jobs');
		};
		
		/**
		 * Вычислять хотфолдер при клике по красочности
		 */
		$scope.calcHF = function() {
			var inks = toDEC(this.workset.inks);
			this.workset.hot_folder = getHotFolder(inks);
		};

		/**
		 * Убирать все двойные кавычки из принт-листа
		 * fixes #3
		 */
		$scope.dropQuotes = function() {
			this.workset.label_path = this.workset.label_path.replace(/\"/g,'');
		};
		
		/**
		 * Переводит массив "0"/"1" из двоичной системы в десятичную
		 *
		 * @param {array} dec Array
		 * @return {int} out
		 */
		function toDEC(dec) {
			var out = 0, len = dec.length, bit = 1;
			while(len--) {
				out += dec[len].used ? bit : 0;
				bit <<= 1;
			}
			return out;
		}

		/**
		 * Определяет hotfolder исходя из красочности задания
		 *
		 * @param {int} num
		 * @return {string} hotfolderName
		 */
		function getHotFolder(num) { 
			var hotfolderName = '';
			if (num % 4 === 0) {
				if (num <= 60) {
					hotfolderName = "CMYK";
				} else {
				hotfolderName = "CMYKW";
				}
			} else {
				hotfolderName = "CMYKOV_White";
			}
			return hotfolderName;
		}
	}]);
	/**
	 * Валидация формы: ожидается положительный float 
	 *
	 * В чём прикол: разделитель дробной части может 
	 * быть как точкой, так и запятой
	 *
	 * @stolen: https://docs.angularjs.org/guide/forms
	 */
	indigoControllers.directive('smartFloat', function() {
		var FLOAT_REGEXP = /^\d+((\.|\,)\d+)?$/;
		return {
			require: 'ngModel',
			link: function(scope, elm, attrs, ctrl) {
				ctrl.$parsers.unshift(function(viewValue) {
					if (FLOAT_REGEXP.test(viewValue)) {
						ctrl.$setValidity('float', true);
						return parseFloat(viewValue.replace(',', '.'));
					} else {
						ctrl.$setValidity('float', false);
						return undefined;
					}
				});
			}
		};
	});

	indigoControllers.controller('Templates', ['$scope', 'Job', 'Template', function($scope, Job, Template) {

		// Шаблоны с базы
		$scope.list = Template.query();
		// Пейджер: http://jsfiddle.net/2ZzZB/56/
		$scope.currentPage = 0;
		$scope.pageSize = 20;
		$scope.numberOfPages = function() {
			return Math.ceil($scope.list.length/$scope.pageSize);
		};
		$scope.rescan = false;

		$scope.submit = function() {
			Job.push({parcel: angular.toJson({run: 'chargeTS', rescan: $scope.rescan})});
		};

	}]);

	// We already have a limitTo filter built-in to angular,
	// let's make a startFrom filter
	indigoControllers.filter('startFrom', function() {
		return function(input, start) {
			start = +start; //parse to int
			return input.slice(start);
		};
	});

	indigoControllers.controller('Jobs', ['$scope', '$location', 'Job', 'socket', function($scope, $location, Job, socket) {
		$scope.list = Job.query();
		$scope.currentPage = 0;
		$scope.pageSize = 20;
		$scope.numberOfPages = function() {
			return Math.ceil($scope.list.length/$scope.pageSize);
		};
		$scope.go = function(path) {
			$location.path(path);
		};
		$scope.statuses = {
			pending: true,
			fetched: true,
			started: true,
			running: true,
			finished: false,
			error: true,
			deleted: false,
		};
		socket.on('jobstatus:changed', function(data) {
			angular.forEach($scope.list, function(value) {
				if (value._id === data._id) {
					value.status = data.status;
				}
			});
		});
	}]);

	indigoControllers.filter('jobStatuses', function() {
		return function(items, options) {
			var selected = [];
			angular.forEach(items, function(value) {
				if (options[value.status]) {
					this.push(value);
				}
			}, selected);
			return selected;
		};
	});
})();
