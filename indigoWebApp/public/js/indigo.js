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
				}).
				when('/addJob', {
					templateUrl: 'jobPush.html',
				}).
				when('/templates', {
					templateUrl: 'templates.html',
				}).
				otherwise({
					redirectTo: '/dashboard.html'
				});
		}
	]);

	app.factory('socket', function($rootScope) {
		/* global io */
		var socket = io.connect();
		return {
			on: function(eventName, callback) {
				socket.on(eventName, function() {
					var args = arguments;
					$rootScope.$apply(function() {
						callback.apply(socket, args);
					});
				});
			}
		};
	});
})();
