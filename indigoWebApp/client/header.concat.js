var indigoControllers = angular.module('indigoControllers', [
		'indigoDatasource',
		'indigoFilters'
	]),
	indigoDatasource = angular.module('indigoDatasource', [
		'ngResource'
	]),
	indigoDirectives = angular.module('indigoDirectives', []),
	indigoFilters = angular.module('indigoFilters', []);
