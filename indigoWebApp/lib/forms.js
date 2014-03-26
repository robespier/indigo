
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
		 * @todo Клонировать параметр `data`
		 *
		 * @param {Object} data Request body
		 * @returns {Boolean} Результат проверки
		 */
		check : function(data) {
			// Эти поля не нужны в `mongodb`:
			delete data.submit;
			delete data.form;
			// Эмулируем ошибку в номере заказа
			var troublefield = this.metadata.fieldgroups.base.fields[0];
			troublefield.help = 'Неверный номер заказа';
			troublefield.css += ' has-error';
			troublefield.value = data.order;
			var goodfield = this.metadata.fieldgroups.base.fields[1];
			goodfield.css += ' has-success';
			goodfield.value = data.customer;
			return false;
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
