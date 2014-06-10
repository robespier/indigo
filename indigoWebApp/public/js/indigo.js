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
})();
