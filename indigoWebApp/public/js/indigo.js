(function() {
	var app = angular.module('indigo', [
		'ngRoute',
		'indigoControllers',
		'indigoDatasource',
	]);

	app.config(['$routeProvider', 
		function($routeProvider) {
			$routeProvider.
				when('/jobs', {
					templateUrl: 'jobs.html',
					controller: 'Jobs',
				}).
				when('/addJob', {
					templateUrl: 'jobPush.html',
					controller: 'JobBlank',
				}).
				when('/templates', {
					templateUrl: 'templates.html',
					controller: 'Templates',
				}).
				otherwise({
					redirectTo: '/dashboard.html'
				});
		}
	]);
})();
