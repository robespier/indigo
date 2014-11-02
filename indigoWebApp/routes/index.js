var _ = require('lodash'),
	orders = require('./orders'),
	jobs = require('./jobs'),
	templates = require('./templates');

/**
 * Попытка вызова функции, пришедшей в запросе
 *
 * @param {function} fn Возможно, функция 
 * @param {object} req passed form Express
 * @param {object} res passed form Express
 */
function route(fn, req, res) {
	if (_.isFunction(fn)) {
		fn(req, res);
	} else {
		res.send(404);
		return;
	}
}

/**
 * Заказы
 */
exports.orders = function(req, res) {
	var method = req.params[1];
	route(orders[method], req, res);
};

/**
 * Задания
 */
exports.jobs = function(req, res) {
	var method = req.params[1];
	route(jobs[method], req, res);
};

/**
 * Шаблоны
 */
exports.templates = function(req, res) {
	var method = req.params[1];
	route(templates[method], req, res);
};

/**
 * info и error
 * 
 * Маршрутизируются в job
 */
exports.data = function(req, res) {
	var method = req.params[1];
	route(jobs[method], req, res);
};

/**
 * Ответы для тестов estk
 */
exports.tests = function(req, res) {
	switch(req.params[1]) {
		case 'fetch':
			res.send(200, 'fetchjob.test');
		break;
		case 'info':
			res.send(200, 'info.test');
		break;
		case 'error':
			res.send(200, 'error.test');
		break;
	}
	res.end();
};

/**
 * Какой-то legacy код
 */
exports.forms = function(req, res) {
    // Если в запросе есть `_id`, заполним форму из базы, иначе покажем пустую
    if (typeof(req.query._id) !== 'undefined') {
		var	order = {
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
			"size_x": 53.5,
			"size_y": 153.75,
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
			inks: [
				{ name: 'Opaque', used: false },
				{ name: 'Cyan', used: true },
				{ name: 'Magenta', used: true },
				{ name: 'Yellow', used: true },
				{ name: 'Black', used: true },
				{ name: 'Orange', used: false },
				{ name: 'Violet', used: true },
			],
			"pms_1": "false",
			"pms_2": "false",
			"pms_3": "false",
			"pms_4": "false",
			"pms_5": "false",
			"pms_6": "false",
			"pms_7": "false",
			"lak": "select",
			"tis": "free",
			"roll": "auto", 
			"roll_type": "outside", 
			"roll_dir": "head_forward",
		};
		res.json(order);
    } else {
		res.json({});
    }
};

