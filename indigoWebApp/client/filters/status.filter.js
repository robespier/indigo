/**
 * Фильтр по полю 'status'
 */
indigoFilters.filter('jobStatuses', function() {
	return function(items, options) {
		var selected = [];
		angular.forEach(items, function(value) {
			if (options[value.status]) {
				this.push(value);
			}
		}, selected);
		return selected;
	};
});
