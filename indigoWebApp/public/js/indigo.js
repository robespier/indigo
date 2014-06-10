(function() {
	var app = angular.module('indigo', []);
	app.controller('OrderBlank', ['$scope', function($scope) {
		$scope.order = {
			"order": "214Ц01892/3",
			"customer": "Артлайф ООО",
			"order_name": "БАДы для Индии (в ассортименте)",
			"manager": "Лотфуллина Э.",
			"master": "Альмухаметов А.",
			"designer": "Сергеев Р.",
			"label_type": "self-label",
			"print_type": "digital",
			"cut": "ready",
			"cut_number": "1152704",
			"size_x": "53",
			"size_y": "153",
			labels: [
				{
					name: "Глюкосил 90 таб",
					file: '',
				},
				{
					name: "Джоинт флекс 90 таб",
					file: '',
				},
				{
					name: "Грин Стар 45 кап",
					file: '',
				},
				{
					name: "Бурдок С 90 таб",
					file: '',
				},
				{
					name: "Формула женщины 90 таб",
					file: '',
				},
				{
					name: "Мемори райс 90 таб",
					file: '',
				},
				{
					name: "Комплекс ферментов 90 таб",
					file: '',
				},
				{
					name: "Хепар 90 таб",
					file: '',
				},
			],
			"ink_0": "true",
			"ink_1": "true",
			"ink_2": "true",
			"ink_3": "true",
			"ink_4": "true",
			"ink_5": "true",
			"ink_6": "false",
			"pms_1": "false",
			"pms_2": "false",
			"pms_3": "false",
			"pms_4": "false",
			"pms_5": "false",
			"pms_6": "false",
			"pms_7": "false",
			"lak": "free",
			"tis": "free",
			"roll": "auto", 
			"roll_type": "outside", 
			"roll_dir": "head_mashine",  
		};
	}]);
})();
