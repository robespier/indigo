(function() {
	var app = angular.module('indigo', ['indigoDatasource']);
	app.controller('OrderBlank', ['$scope', 'Blank', function($scope, Blank) {
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

	app.controller('JobBlank', ['$scope', 'Job', 'Blank', function($scope, Job, Blank) {

		/**
		 * Значения по умолчанию
		 */
		$scope.workset = {
//			cut_number: 1000,
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
				{ name: 'assembly', process: true },
				{ name: 'matching', process: false },
				{ name: 'achtung', process: false },
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
			Job.save($scope.workset);
		};
		
		/**
		 * Вычислять хотфолдер при клике по красочности
		 */
		$scope.calcHF = function() {
			var inks = toDEC(this.workset.inks);
			this.workset.hot_folder = getHotFolder(inks);
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
				hotfolderName = "CMYKOW_White";
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
	app.directive('smartFloat', function() {
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
})();
