var app = angular.module('indigo', [
	'ngRoute',
	'indigoControllers',
	'indigoDatasource',
]);

app.config(['$routeProvider', 
	function($routeProvider) {
		$routeProvider.
			when('/jobs', {
				templateUrl: 'paritals/jobs.list.html',
			}).
			when('/addJob', {
				templateUrl: 'paritals/job.edit.html',
			}).
			when('/templates', {
				templateUrl: 'paritals/templates.html',
			}).
			otherwise({
				redirectTo: 'index.html'
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
