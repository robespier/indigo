
module.exports = exports = forms = {

/**
 * Бланк заказа
 */
	blank : {
		title : 'Бланк заказа',
		id: 'fillBlank-form',
		name: 'fillBlank',
		method: 'POST',
		action: 'http://indigo.aicdr.pro:8080/data/json/fillBlank',
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
					{ name: 'action', type: 'hidden', value: 'BlankComposer'}
				]
			}
		}
	},
	settings : {
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
	}

};
