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
		roll_var: 'auto',
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
			{ name: 'MatchingImposer', process: false },
			{ name: 'AchtungImposer', process: false },
		],
	};
	
	$scope.getRoll = function() {
		var roll;
		if((this.workset.roll_type==='outside')&&(this.workset.roll_dir==='head_mashine')){
			roll='roll_1_6';
		}	
		if((this.workset.roll_type==='inside')&&(this.workset.roll_dir==='head_mashine')){
			roll='roll_1_6';
		}
		if((this.workset.roll_type==='outside')&&(this.workset.roll_dir==='foot_mashine')){
			roll='roll_2_5';
		}
		if((this.workset.roll_type==='inside')&&(this.workset.roll_dir==='foot_mashine')){
			roll='roll_2_5';
		}
		if((this.workset.roll_type==='outside')&&(this.workset.roll_dir==='foot_forward')){
			roll='roll_3_7';
		}	
		if((this.workset.roll_type==='inside')&&(this.workset.roll_dir==='foot_forward')){
			roll='roll_3_7';
		}
		if((this.workset.roll_type==='outside')&&(this.workset.roll_dir==='head_forward')){
			roll='roll_4_8';
		}
		if((this.workset.roll_type==='inside')&&(this.workset.roll_dir==='head_forward')){
			roll='roll_4_8';
		}
		$scope.workset.roll = roll;
		return roll;
	};

	/**
	 * Set roll image from click on rolls radio group
	 *
	 * @param {string} direction Predefined direction
	 */
	$scope.setRolltype = function(roll_type) {
		this.workset.roll_type = roll_type;
	};
	$scope.setRolldir = function(roll_dir) {
		this.workset.roll_dir = roll_dir;
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
