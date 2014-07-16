indigoControllers.controller('Templates', [
	'$scope',
	'Job',
	'Template',
	function($scope, Job, Template) {
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
	}]
);
