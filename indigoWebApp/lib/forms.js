var _ = require('lodash'),
	MongoClient = require('mongodb').MongoClient,
	ObjectId = require('mongodb').ObjectID;

module.exports = exports = {
	/**
	 * Бланк заказа
	 */
	blank : {
		metadata: {
			title : 'Order blank',
			id: 'fillBlank-form',
			name: 'blank',
			method: 'POST',
			action: 'http://indigo.aicdr.pro:8080/data/json/forms',
			css: 'container form-horizontal',
			fieldgroups : {
				base: {
					css: {
						whole: 'col-md-3',
						labels: 'col-md-1 control-label',
						fields: 'col-md-12'
					},
					fields: [
						{ name: 'order', desc: '№_заказа', type: 'text', css: 'form-group'},
						{ name: 'customer', desc: 'Заказчик', css: 'form-group', type: 'text'},
						{ name: 'order_name', desc: 'Наименование_заказа', css: 'form-group', type: 'text'},
						{ name: 'manager', desc: 'Менеджер', css: 'form-group', type: 'text'},
						{ name: 'master', desc: 'Технолог', css: 'form-group', type: 'text'}, 
						{ name: 'designer', desc: 'Дизайнер', css: 'form-group', type: 'text'} 
					]
				},

					label_list: {
					css: {
						whole: 'col-md-6',
						labels: 'col-md-1 control-label',
						fields: 'col-md-12'
					},
					fields: [
						{ name: 'assort', desc: 'Ассортимент', type: 'text', css: 'form-group'},
					]
				},

					suppl: {
					css: {
						whole: 'col-md-3',
						labels: 'col-md-1 control-label',
						fields: 'col-md-12'
					},
					fields: [
						{ name: 'print_type', element: 'select', desc: 'Печать', css: 'form-group', options: ['цифровая','флексо']},
						{ name: 'label_type', element: 'select', desc: 'Этикетка', css: 'form-group', options: ['самоклеющаяся','термоусадочная','в оборот','in-mold']},
						{ name: 'cut', element: 'select', desc: 'Высечка', css: 'form-group', options: ['готовая','заказная','плоттер','без высекания']},
						{ name: 'stamp_number', desc: '№_штампа', type: 'text', css: 'form-group'},
						{ name: 'roll_type', element: "radiolist", css: 'form-group', options: [ {value: 'hand', content: 'ручная'}, {value: 'auto', content: 'автоматическая'} ], desc: 'Намотка'},
						{ name: 'inks', element: "checklist", css: 'form-group', options: [ {name: 'ink_0', content: 'Opaque'}, {name: 'ink_1', content: 'Cyan'}, {name: 'ink_2', content: 'Magenta'}, {name: 'ink_3', content: 'Yellow'}, {name: 'ink_4', content: 'Black'}, {name: 'ink_5', content: 'Orange'}, {name: 'ink_6', content: 'Violet'} ], desc: 'Красочность'},
					]
				},
				submit: {
					css: {
						whole: 'col-md-12'
					},
					fields: [
						{ name: 'submit', element: 'button', css: 'form-group', type: 'submit'},
						{ name: 'form', type: 'hidden', value: 'blank' },
						{ name: 'action', type: 'hidden', value: 'BlankComposer'}
					]
				}
			}
		},
		/**
		 * Коллекция, в которой хранятся данные формы.
		 *
		 * Реализуем самый примитивный вариант, когда все данные хранятся 
		 * в одном месте.
		 */
		db: {
			collection: 'indigoJobs'
		},
		/**
		 * Проверка введённых в форму данных
		 *
		 * @param {Object} body req.body
		 * @returns {Object} Результат проверки
		 */
		check : function(body) {
			// Клонируем req.body, чтоб не испортить ненароком.
			// Может, ещё сгодится для чего		
			var data = _.clone(body, true);

			// Эти поля не нужны в `mongodb`:
			delete data.submit;
			delete data.form;

			// Для начала определим, какие поля проверять.  
			var validators = this._map_callbacks_to_fields();
		
			// Заготовим ёмкость для ошибок
			data._fail = {};

			// Выполним проверку
			Object.keys(validators).forEach(function(field) {
				var validator = validators[field];

				// В данном контексте `this` -- это `data`, так как
				// мы передали её вторым параметром в `forEach`
				var value = this[field];

				// Если валидатор находит в значении поля ошибку,
				// сохраним это поле в `data`;
				if (!validator.check(value, validator.field)) {
					this._fail[field] = validator.field;
				}
			}, data);

			// Пример ручной проверки
			// Зная расположение полей в структуре `metadata`, можно по быстрому
			// накидать проверку нестандартной логики.
			//
			// Дизайнер Бубликов и технолог Баранкин друг друга не переносят.
			// По работе им лучше не пересекаться, иначе страдает производство.
			if (data.designer === 'Бубликов' && data.master === 'Баранкин') {
				var heap = this.metadata.fieldgroups.base.fields,
					barank = heap[4],
					bublik = heap[5];
				barank.css += ' has-warning';
				barank.value = data.master;
				bublik.css += ' has-warning';
				bublik.value = data.designer;
				barank.help = bublik.help = 'Этих друзей лучше вместе не ставить';
				data._fail.master = bublik;
				data._fail.designer = barank;
			}
			
			// Если ни один валидатор не нарыл ошибок, удалим объект `data._fail`.
			// Подозреваю, что в будущем отсутствие поля `_fail` в документе 
			// сильно упростит выборку из базы данных.
			if (Object.keys(data._fail).length < 1) {
				delete data._fail;
			}
			
			return data;
		},
		/**
		 * Определим, для каких полей реализованы функции проверки
		 *
		 * Имя функции проверки (валидатора) совпадает с именем поля.
		 * Т.е. если в запросе присутствует поле `order` и его нужно 
		 * проверить, валидатор должен называться `validate.order`. 
		 * Если валидатора с таким названием нет, поле не проверяется.
		 * Собираем коллекцию валидаторов и добавляем к ним поля  
		 * метаданных. В эти поля мы будем писать результаты проверок  
		 * и отдавать их клиенту в случае возникновения ошибок.
		 * 
		 * @return {object} 
		 */
		_map_callbacks_to_fields: function() {
			
			var	meta_fields = {};
			
			var callbacks = this.validate;
			Object.keys(callbacks).forEach(function(cb) {
				meta_fields[cb] = {};
				meta_fields[cb].check = callbacks[cb];
			});

			var heap = this.metadata.fieldgroups;
			Object.keys(heap).forEach(function(group) {
				var fields = heap[group].fields;
				Object.keys(fields).forEach(function(key) {
					if (typeof(meta_fields[fields[key].name]) !== 'undefined') {
						meta_fields[fields[key].name].field = fields[key];
					}
				});
			});
			
			return meta_fields;
		},
		/**
		 * Загрузка данных из базы
		 *
		 * @param {object} options
		 * @param {function} next 
		 */
		load: function(options, next) {
			MongoClient.connect('mongodb://127.0.0.1:27017/indigo', function(err, db) {
				if (err) { next(err); return; }
				var jobsCollection = db.collection(options.collection);
				jobsCollection.find({_id: new ObjectId(options.id)}).nextObject(function(err, parcel) {
					next(err, parcel);
				});
			});
		},
		/**
		 * Вставка данных из базы в поля формы
		 *
		 * @param {object} result
		 */
		merge: function(result) {
			// в данном контексте `this` -- это объект `form`
			// идём по метаданным формы и намешиваем туда данных из `result` и `this._fail`
			var heap = this.metadata.fieldgroups;
			Object.keys(heap).forEach(function(group) {
				var fields = heap[group].fields;
				Object.keys(fields).forEach(function(key) {
					// Вынос мозга!
					// fields[key] -- {object} field
					// fields[key].name -- 'order', {string}
					// result[fields[key].name] -- 'd132213', {string}
					if (typeof(result[fields[key].name]) !== 'undefined') {
						fields[key].value = result[fields[key].name];
					}
					// Поддать ошибок, если есть
					// result._fail[fields[key].name]) -- 'order', {object} field
					if (typeof(result._fail) !== 'undefined') {
						if (typeof(result._fail[fields[key].name]) !== 'undefined') {
							fields[key] = result._fail[fields[key].name];
						}
					}
				}); 
			});
		},
		/**
		 * Функции проверки полей (валидаторы)
		 */
		validate : {
			order: function(value, field) {
				var result = true;
				// Пример более осмысленной проверки:
				// Номер заказа должен состоять из цифр и начинаться с 'd'
				if (!value.match(/^d[0-9]+$/)) {
					field.css += ' has-error';
					field.help = 'Номер заказа вызывает подозрения';
					field.value = value;
					result = false;
				}
				return result;
			}
		}
	},
	/**
	 *
	 */
	settings : {
		metadata: {
			title : 'Настройки',
			id: 'settings-form',
			name: 'settings',
			method: 'POST',
			action: 'http://indigo.aicdr.pro:8080/data/json/settings',
			css: 'container form-horizontal',
			fieldgroups : {
				base: {
					css: {
						whole: 'col-md-12',
						labels: 'col-md-4 control-label',
						fields: 'col-md-8'
					},
					fields: [
						{ name: 'blank_path', desc: 'Путь к файлу шаблона бланка' },
					]
				}
			}
		},
		check : function(data) {
			// чтобы Jshint замолчал на время:
			delete data.submit;
			delete data.form;
		}
	}
};
