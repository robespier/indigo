#target Illustrator-15

var makeLayout = {

	// ========== Properties: ========== //

	// TODO: Use Folder objects
	// TODO: Потому что на маке разделитель другой
	work_root: 'W:\\', 
	template_path: makeLayout.work_root + 'docs\\template\\',
	jobs_path: makeLayout.work_root + 'docs\\jobcontainer\\',
	output_path: makeLayout.work_root + 'output\\',
	ill: undefined,			// Application
	template: undefined,	// Document

	// ========== Functions: ========== //

	/*
	 * Возвращает массив с именами фалов этикеток 
	 * @return array
	 */
	getPrintList: function () {
		// TODO: Stub
		// get aray from real source (plain text, xml, database)
		p = makeLayout.getJobName();
		pl = [p+'label_one.eps',p+'label_two.eps',p+'label_three.eps',p+'label_four.eps'];
		return pl;
	},

	/*
	 * Возвращает папку с этикетками 
	 * @return: string
	 */
	getJobName: function () {
		// TODO: Stub
		// return real job name;
		fakeName = makeLayout.jobs_path + "d1234567\\";
		return fakeName;
	},

	/*
	 * Возварщает имя файла шаблона
	 * @return: string
	 */
	getTemplateName: function () {
		// TODO: Stub
		// return real template;
		fakeName = "1064003.ai";
		result = makeLayout.template_path + fakeName;
		return result;
	},

	/*
	 * Открыть шаблон и вернуть ссылку на него
	 * @return: Document object
	 */
	getTemplateDoc: function() {
		var template_file_name = this.getTemplateName();
		try {
			var template_file = new File (template_file_name);
			var app = this.ill;
			var template = app.open (template_file);
			return template;
		}
		catch (exc) {
			// TODO: catch exception
		}
	},

	/*
	 * Инициализацая переменных
	 * @param object Illustrator Application
	 * @return object this
	 */
	setup: function(app) {
		this.ill = app;
		//открыть файл $шаблона (template.ai);
		this.template = this.getTemplateDoc();
		//считать из файла массив этикеток $print_list;
		//получить ссылку на слой cut файла шаблона;
		//найти самый нижний элемент слоя cut;
		//сохранить $координаты самого нижнего элемента слоя cut;
		//получить ссылку на слой $Layer файла шаблона;
		//получить ссылку на коллекцию стилей в шаблоне;
		//выбрать $стиль, который будет применяться к этикетке;
	},

	/*
	 * Script entry point
	 */
	main: function() {

	}
}

pill = makeLayout.setup(app);
