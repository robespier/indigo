(function() {
	var indigoDatasource = angular.module('indigoDatasource', ['ngResource']);
	indigoDatasource.factory('Blank', ['$resource', function($resource) {
		return $resource('forms/blank');
	}]);
	indigoDatasource.factory('Job', ['$resource', function($resource) {
		return $resource('data/json/jobs/:action', {action: 'list'}, {
			list: {method: 'GET', params: {action: 'list'}},
			push: {method: 'POST', params: {action: 'push'}},
			drop: {method: 'DELETE', params: {action: 'drop'}},
		});
	}]);
	indigoDatasource.factory('Template', ['$resource', function($resource) {
		return $resource('data/json/templates/:action', {action: 'list'});
	}]);
})();
