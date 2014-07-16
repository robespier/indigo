indigoControllers.controller('Jobs', [
	'$scope',
	'$location',
	'Job',
	'socket',
	function($scope, $location, Job, socket) {
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
	}
]);
