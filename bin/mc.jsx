#target Illustrator-13

var mc = {
	illustrator: null, // Illustrator Application Object
	setup: function(app) {
		this.illustrator = app;
		this.task = 1111111; //Определяем переменные для паспорта 
		this.temp = 4090354; //шаблона
		this.roll_number = 4; //и намотки, которые задаются в окне диалога или выцепляются из базы данных
		this.jobFolder = new Folder ('Z:\\d' + this.task); //Папка паспорта (рабочего каталога)
		this.templateFolder = new Folder ('D:\\work\\template'); //Каталог шаблонов сборки
		this.prListFolder = new Folder ('D:\\work\\print_list'); //Папка, где находятся принт-листы
		this.prList = new File (this.prListFolder + '\\d' + this.task + '.csv'); //Ссылка на файл принт-листа
		this.printList = []; //Массив строк из принт-листа
	},
	/*
	 * Открытие шаблона
	 * @returns Document Object
	 */
	openTemplate: function() {
		var template = new File (this.templateFolder + '\\' + this.temp + '.ai'); //Ссылка на файл шаблона
		this.illustrator.open (template); //Открываем шаблон
		var myDoc = app.activeDocument; //Создаем ссылку на активный документ
		myDoc.rulerOrigin = [0,0]; //Обнуляем центр координат
		this.template = myDoc;
		return this.template;
	},
	/*
	 * Установка слоя 'Label'
	 * @returns Layer Object
	 */
	setLabelLayer: function() {
		newlayer = this.template.layers.add(); //Создаем слой для размещения этикеток
		newlayer.name = 'label'; //называем его именем label
		newlayer.zOrder(ZOrderMethod.SENDTOBACK); //и помещаем его в самый низ в пачке слоев документа
		return this.template.layers['label'];
	},
	/*
	 *
	 */
	getLowerCut: function() {
	},
	/*
	 * Шаблонный метод -- Make Collection
	 */
	run: function(app) {
		mc.openTemplate();
		mc.setLabelLayer();
	}
}
