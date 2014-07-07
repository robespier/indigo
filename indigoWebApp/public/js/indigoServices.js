(function() {
	var indigoDatasource = angular.module('indigoDatasource', ['ngResource']);
	indigoDatasource.factory('Blank', ['$resource', function($resource) {
		return $resource('forms/blank');
	}]);
	indigoDatasource.factory('Job', ['$resource', function($resource) {
		return $resource('data/json/pushJob');
	}]);
	indigoDatasource.factory('JobList', ['$resource', function($resource) {
		return $resource('data/json/jobs');
	}]);
	indigoDatasource.factory('Template', ['$resource', function($resource) {
		return $resource('data/json/templates');
	}]);
})();
