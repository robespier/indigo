indigoControllers.controller('JobBlank', [
	'$scope',
	'$location',
	'Job',
	'strings',
	function($scope, $location, Job, strings) {

	$scope.strings = strings;
	
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
	 * Сопоставление 'имя намотки' => стиль/имя файла
	 * 
	 * @type {object}
	 */
	var dirMap = {
		head_mashine: 'roll_1_6',
		foot_mashine: 'roll_2_5',
		foot_forward: 'roll_3_7',
		head_forward: 'roll_4_8'
	};
	
	/**
	 * Get image of roll direction
	 *
	 * @param {string} direction Predefined direction
	 * @returns {string} img Icon relative filename
	 */
	$scope.getRollImage = function() {
		var direction = $scope.workset.roll_dir,
			img = 'roll_undefinded';

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
		$scope.workset.roll_dir = direction;
	};

	/**
	 * Отправка формы и перенаправление на список заданий
	 * 
	 * @returns {undefined}
	 */
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
