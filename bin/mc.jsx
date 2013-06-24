#target Illustrator-13

function mc(app) {
	this.illustrator = app;
}

mc.prototype = {
	setup: function() {
		this.task = 1111111; //Определяем переменные для паспорта 
		this.temp = 4090354; //шаблона
		this.roll_number = 4; //и намотки, которые задаются в окне диалога или выцепляются из базы данных
		this.jobFolder = new Folder ('Z:\\d' + this.task); //Папка паспорта (рабочего каталога)
		this.templateFolder = new Folder ('D:\\work\\template'); //Каталог шаблонов сборки
		this.prListFolder = new Folder ('D:\\work\\print_list'); //Папка, где находятся принт-листы
		this.prList = new File (this.prListFolder + '\\d' + this.task + '.csv'); //Ссылка на файл принт-листа
		this.printList = []; //Массив строк из принт-листа
		this.PDFSettings = new PDFSaveOptions(); // Настройки экспорта в PDF
		this.PDFSettings.acrobatLayers = false;
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
		newlayer = this.template.layers.add(); // Создаем слой для размещения этикеток
		newlayer.name = 'label'; // называем его именем label
		newlayer.zOrder(ZOrderMethod.SENDTOBACK); // и помещаем его в самый низ в пачке слоев документа
		return this.template.layers['label'];
	},
	/*
	 * Находим левый нижний контур высечки
	 * @returns PathItem
	 */
	getLowerCut: function() {
		var cuts = this.template.layers['cut'].pathItems; // Создаем ссылку на массив высечек
		sumXY = new Array (cuts.length); // Cоздаем массив, в котором сохраняем сумму X и Y-позиций всех элементов массива высечек.
		for (i=0, l=cuts.length; i < l; i++) {
			var xPos = cuts[i].position[0];
			var yPos = cuts[i].position[1];
			sumXY[i] = xPos+yPos;
		}
		var target_index = 0; // Находим индекс мин. значения массива
		target_sum = sumXY[0];

		for (i=0, l=sumXY.length; i < l; i++) {
			if (sumXY[i] <= target_sum) {
				target_index = i;
				target_sum = sumXY[i];
			}
		}
		var targetCut = cuts[target_index]; // Определяем целевой контур
		this.targetCut = targetCut;
		return this.targetCut;
	},
	/*
	 * Получить массив этикеток для печати
	 * @returns Array of File Objects
	 */
	getLabels: function() {
		this.labels = []; // Экземплярная переменная для хранения этикеток
		this.prList.open(); //Открываем принт-лист ; TODO Слишком жесткая связь
		while (line=this.prList.readln()) {
			//printList.push(line); //Считываем одну строку из print_list
			var file_parts = line.split(";");
			file_parts[0]; //Берем из строки номер этикетки
			file_parts[1]; //Берем из строки наименование этикетки
			file_name = this.jobFolder + '\\' + file_parts[1];
			var labelObjectFile= new File (file_name); //Создаем ссылку на файл этикетки
			this.labels.push(labelObjectFile); // Сохраняем ссылку на файл в экземплярной переменной
		}
		this.prList.close();
		return this.labels;
	},
	/*
	 * Шаблонный метод -- Make Collection
	 */
	run: function() {
		this.openTemplate();
		this.setLabelLayer();
		this.getLowerCut();
		this.getLabels();
		this.placeLabel();
		this.alignLabel();
	},
	/*
	 * Экспорт
	 */

}
