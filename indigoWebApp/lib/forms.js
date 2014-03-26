
module.exports = exports = forms = {
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
						{ name: 'order', desc: '№ заказа', type: 'text'},
						{ name: 'customer', desc: 'Заказчик', type: 'text'},
						{ name: 'order_name', desc: 'Наименование заказа', type: 'text'},
						{ name: 'manager', desc: 'Менеджер', type: 'text'},
						{ name: 'master', desc: 'Технолог', type: 'text'}, 
						{ name: 'designer', desc: 'Дизайнер', type: 'text'} 
					]
				},
				suppl: {
					css: {
						whole: 'col-md-6',
						labels: 'col-md-4 control-label',
						fields: 'col-md-8'
					},
					fields: [
						{ name: 'print_type', element: 'select', desc: 'Тип печати', options: ['цифровая','флексо']},
						{ name: 'label_type', element: 'select', desc: 'Тип этикетки', options: ['самоклеющаяся','термоусадочная','в оборот','in-mold']},
						{ name: 'roll_type', element: "radiolist", options: [ {value: 'hand', content: 'ручная'}, {value: 'auto', content: 'автоматическая'} ], desc: 'Тип намотки'},
						{ name: 'inks', element: "checklist", options: [ {name: 'ink_0', content: 'Opaque'}, {name: 'ink_1', content: 'Cyan'} ], desc: 'Красочность'},
					]
				},
				submit: {
					css: {
						whole: 'col-md-12'
					},
					fields: [
						{ name: 'submit', element: 'button', type: 'submit'},
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
		 * `data` -- это объект `req.body`, и передаётся он по ссылке.  
		 * Это значит, что изменяя поля `data`, на самом деле мы изменяем 
		 * `req.body`. А это не самая хорошая идея, так как возможно 
		 * этот запрос пригодится нам позже и в другом совершенно месте.
		 */
		check : function(data) {
			// Эти поля не нужны в `mongodb`:
			delete data.submit;
			delete data.form;
			return data;
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
		}
	}
};
