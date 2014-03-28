var _ = require('lodash');

module.exports = exports = {
	/**
	 * Бланк заказа
	 */
	blank : {
		metadata: {
			title : 'Бланк заказа',
			id: 'fillBlank-form',
			name: 'blank',
			method: 'POST',
			action: 'http://indigo.aicdr.pro:8080/data/json/forms',
			css: 'container form-horizontal',
			fieldgroups : {
				base: {
					css: {
						whole: 'col-md-6',
						labels: 'col-md-4 control-label',
						fields: 'col-md-8'
					},
					fields: [
						{ name: 'order', desc: '№ заказа', type: 'text', css: 'form-group'},
						{ name: 'customer', desc: 'Заказчик', css: 'form-group', type: 'text'},
						{ name: 'order_name', desc: 'Наименование заказа', css: 'form-group', type: 'text'},
						{ name: 'manager', desc: 'Менеджер', css: 'form-group', type: 'text'},
						{ name: 'master', desc: 'Технолог', css: 'form-group', type: 'text'}, 
						{ name: 'designer', desc: 'Дизайнер', css: 'form-group', type: 'text'} 
					]
				},
				suppl: {
					css: {
						whole: 'col-md-6',
						labels: 'col-md-4 control-label',
						fields: 'col-md-8'
					},
					fields: [
						{ name: 'print_type', element: 'select', desc: 'Тип печати', css: 'form-group', options: ['цифровая','флексо']},
						{ name: 'label_type', element: 'select', desc: 'Тип этикетки', css: 'form-group', options: ['самоклеющаяся','термоусадочная','в оборот','in-mold']},
						{ name: 'roll_type', element: "radiolist", css: 'form-group', options: [ {value: 'hand', content: 'ручная'}, {value: 'auto', content: 'автоматическая'} ], desc: 'Тип намотки'},
						{ name: 'inks', element: "checklist", css: 'form-group', options: [ {name: 'ink_0', content: 'Opaque'}, {name: 'ink_1', content: 'Cyan'} ], desc: 'Красочность'},
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
		 * @returns {Boolean} Результат проверки
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
		
			// Выполним проверку
			Object.keys(validators).forEach(function(field) {
				var validator = validators[field];

				// В данном контексте `this` -- это `data`, так как
				// мы передали её вторым параметром в `forEach`
				var value = this[field];

				// Если хотя бы один валидатор найдёт ошибку,
				// установим в `data` "провальный" флаг;
				if (!validator.check(value, validator.field)) {
					this._fail = true;
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
				data._fail = true;
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
		 * Функции проверки полей (валидаторы)
		 */
		validate : {
			order: function(value, field) {
				var result = true;
				if (value !== 'e3hvds1') {
					field.css += ' has-error';
					field.help = 'Не угадал!';
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
