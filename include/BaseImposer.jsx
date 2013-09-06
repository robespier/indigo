/**
 * Сюда вынесен код только для Иллюстратора. Зачем такие сложности?
 * Стоит объявить target Illustrator, как тут же отваливается класс Socket();
 * Похоже, это правильно, в 'JavaScript Tools Guide CS3', стр. 160 ясно сказано,
 * какие приложения в пакете поддерживают класс Socket, и Иллюстратора
 * среди них нет.
 * Так что это небольшой хак;
 */

///#target Illustrator-13

/**
 * @class
 * @classdesc Суперкласс для сборщиков спусков
 * @prop {string} temp Имя шаблона, без расширения .ai
 * @prop {string} roll_number Числовой индекс намотки
 * @prop {string} hotFolderName Имя "хотфолдера" на RIP 
 * @prop {array} printList Массив объектов File с этикетками
 * @constructor 
 * @param {object} app Ссылка на объект Adobe Illustrator
 */
Indigo.BaseImposer = function(app) {
	this.illustrator = app;
	this.illustrator.userInteractionLevel = UserInteractionLevel.DONTDISPLAYALERTS;
};

Indigo.BaseImposer.prototype = {
	/**
	 * Инициализация сборки
	 * @param {object} job Параметризующий объект с деталями задания
	 */
	setup: function(job) {
		this.temp = job.template;
		this.roll_number = job.roll; //и намотки, которые задаются в окне диалога или выцепляются из базы данных
		this.hotfolderName = job.separations;
		this.hotFolder = new Folder ('X:\\' + this.hotfolderName); //Горячая папка
		this.templateFolder = new Folder ('D:\\work\\template'); //Каталог шаблонов сборки
		this.printList = job.print_list; //Массив строк из принт-листа
		this.PDFSettings = new PDFSaveOptions(); // Настройки экспорта в PDF
		this.PDFSettings.acrobatLayers = false;
		this.job = job;
	},

	/**
	 * Возврат ссылки на файл шаблона
	 *
	 * @return {File} template
	 */
	getTemplateName: function () {
		var template = new File (this.templateFolder + '\\short\\' + this.temp + '_short' + '.ai');
		return template;	
	},

	/**
	 * Открытие шаблона и сохранение ссылки на него в экземплярной переменной this.template
	 *
	 * @throws {customException} Нет файла шаблона
	 * @return {Document} Активный документ
	 */
	openTemplate: function() {
		var template = this.getTemplateName();
		try {
			this.illustrator.open (template); //Открываем шаблон
		} catch (e) {
			// interrupt normal flow
			throw {
				message: e.message,
				source: 'openTemplate',
				file: template.fullName,
				severity: 'error',
				jobid: this.job.id,
			};
		}
		var myDoc = app.activeDocument; //Создаем ссылку на активный документ
		myDoc.rulerOrigin = [0,0]; //Обнуляем центр координат
		this.template = myDoc;
		return this.template;
	},

	/**
	 * Создание слоя 'Label' под размещение этикеткок
	 *
	 * @return {Layer} Слой этикеток
	 */
	setLabelLayer: function() {
		// Создаем слой для размещения этикеток
		this.labelLayer = this.template.layers.add();
		// называем его именем label
		this.labelLayer.name = 'label';
		// и помещаем его в самый низ в пачке слоев документа
		this.labelLayer.zOrder(ZOrderMethod.SENDTOBACK);
		return this.template.layers['label'];
	},

	/**
	 * Нахождение левого нижнего контура высечки. Относительно него будет размещаться этикетки
	 *
	 * @return {PathItem} Левый нижний элемент со слоя 'cut'
	 */
	getLowerCut: function() {
		// Создаем ссылку на массив высечек
		var cuts = this.template.layers['cut'].pathItems; 
		// Cоздаем массив, в котором сохраняем сумму X и Y-позиций всех элементов массива высечек.
		var sumXY = new Array (cuts.length);
		for (var i=0, l=cuts.length; i < l; i++) {
			var xPos = cuts[i].position[0];
			var yPos = cuts[i].position[1];
			sumXY[i] = xPos+yPos;
		}
		// Находим индекс мин. значения массива
		var target_index = 0; 
		var target_sum = sumXY[0];

		for (var it=0, lt=sumXY.length; it < lt; it++) {
			if (sumXY[it] <= target_sum) {
				target_index = it;
				target_sum = sumXY[it];
			}
		}
		// Определяем целевой контур
		this.targetCut = cuts[target_index];
		return this.targetCut;
	},

	/**
	 * Получение массива этикеток в задании
	 *
	 * @return {array} Массив объектов File
	 */
	getLabels: function() {
		// Инициализация экземплярной переменной для хранения этикеток
		this.labels = []; 
		for (var i=0, prl = this.printList.length; i < prl; i++) {
			// Создаем ссылку на файл этикетки
			var labelObjectFile = new File (this.printList[i]);
			// Сохраняем ссылку на файл в экземплярной переменной
			this.labels.push(labelObjectFile);
		}
		return this.labels;
	},
	
	/**
	 * В некоторых ситуациях сборку делать не нужно. К примеру, если 
	 * этикетка всего одна, то сборки "Утверждение" и "Внимание" должны
	 * игнорироваться.
	 * В этом методе может быть переопределена логика такой ситуации.
	 *
	 * @return {boolean}
	 */
	isNeed: function() {
		if (this.labels.length < 2) {
			return false;
		}
	},

	/**
	 * Выбор намотки. 
	 *
	 * @return {GraphicStyle} 
	 */
	getStyle: function() {
		// Считываем массив намоток (графических стилей) документа
		var myRolls = this.template.graphicStyles;
		// Намотка по умолчанию - 2
		var myStyle = 'roll_2_5';
		switch(this.roll_number) {
			case "0":
				if (this.transform()) {
					myStyle=myRolls['roll_1_6']; // Крутить
				} else {
					myStyle=myRolls['roll_4_8']; // Не крутить
				}
				break;
			case "1":
				myStyle=myRolls['roll_1_6'];
					break;
			case "2":
				myStyle=myRolls['roll_2_5'];
					break;
			case "3":
				myStyle=myRolls['roll_3_7'];
					break;
			case "4":
				myStyle=myRolls['roll_4_8'];
					break;
			case "5":
				myStyle=myRolls['roll_2_5'];
					break;
			case "6":
				myStyle=myRolls['roll_1_6'];
					break;
			case "7":
				myStyle=myRolls['roll_3_7'];
					break;
			case "8":
				myStyle=myRolls['roll_4_8'];
					break;
			default:
				//todo Throw exception here
				//alert ('No such roll: ' + this.roll_number);
				break;
		}
		return myStyle;
	},

	/**
	 * Логика определения намотки;
	 * Вызывается из getStyle.switch...
	 * 
	 * @return {boolean}
	 */
	transform: function() {
		// Ручная намотка
		// ПРЯМОУГОЛЬНАЯ / ОВАЛЬНАЯ ЭТИКЕТКА
		// 1 - квадрат, крутить не надо;
		// 0.999 ширина меньше высоты, крутим на -90 градусов
		// 1.999 ширина больше высоты, крутить не надо
		var targetCutRate = this.targetCut.width / this.targetCut.height;
		var labelRate = this.currentLabel.width / this.currentLabel.height;
		return (((targetCutRate < 1) && (labelRate > 1)) || ((targetCutRate > 1) && (labelRate < 1)));
	},

	/**
	 * Поместить и позиционировать этикетку на слой labels
	 * 
	 * @param {PathItem} origin Элемент спуска, относительно которого помещать этикетку;
	 * @param {File} file Объект File, который необходимо поместить;
	 * @return {void}
	 */ 
	placeLabel: function(origin, file) {
		// Определяем ширину единичного контура высечки
		var LsizeX = this.targetCut.width; 
		// Определяем высоту единичного контура высечки
		var LsizeY = this.targetCut.height; 
		// Помещаем File на спуск и сохраняем ссылку на него в экземплярной переменной this.currentLabel
		this.currentLabel = this.labelLayer.placedItems.add();
		var cl = this.currentLabel;
		cl.file = file;
		// Выравниваем этикетку по целевому контуру (параметр origin)
		var clX = origin.position[0]+(LsizeX/2) - (cl.width/2);
		var clY = origin.position[1]-(LsizeY/2) + (cl.height/2);
		cl.position = new Array (clX, clY); 
	},

	/**
	 * Применение графического стиля к ТЕКУЩЕЙ этикетке. 
	 * "Текущая эткетка" - это this.currentLabel
	 *
	 * @return {void}
	 */
	applyStyle: function() {
		var myStyle = this.getStyle();
		// Применям графический стиль к этикетке
		myStyle.applyTo(this.currentLabel); 
	},

	/**
	 * Генерация имени файла для экспорта в PDF
	 *
	 * @param {number} index Иногда нужен, когда этикеток в задании много и необходима нумерация файлов
	 * @return {string} Имя PDF сборки
	 */
	getPDFName: function(index) {
		if (this.currentLabel instanceof File) {
			this.child = this.currentLabel.parent;
		} else {
			this.child = this.currentLabel.file.parent;
		}

		// Определение диапазон папок 
		var targetName = [];
		for (var i=0, l=this.labels.length; i < l; i++) {
			targetName[i]= this.labels[i].parent.name;
		}

		targetName.sort();

		var range = targetName[0] + '_' + targetName[targetName.length-1];

		// Common Name prefix
		var cName = this.child.parent.parent.name + this.child.parent.name;
		// Имя файла сборки
		return this.getPDFPart(index, range, cName);
	},

	/**
	 * Экспорт сборки в формате PDF 
	 * @param {string} fileName Имя файла для экспорта
	 * @return {void}
	 */
	exportPDF: function(fileName) {
		this.ResultFilePDF = new File (fileName);
		this.template.saveAs(this.ResultFilePDF, this.PDFSettings);
	},

	/**
	 * Копирование готового файла сборки в "горячую" папку растрового процессора
	 * @return {void}
	 */
	sendtoHotFolder: function() {
		this.ResultFilePDF.copy(this.hotFolder + '\\' + this.ResultFilePDF.name);	
	},

	/**
	 * Закрытие активного документа без сохранения
	 * @return {void}
	 */
	closeTemplate: function() {
		this.template.close(SaveOptions.DONOTSAVECHANGES);
	},
	
	/**
	 * Логика выполнения сборок. 
	 * Паттерн "Шаблонный метод"
	 */
	run: function() {
		this.getLabels();
		if (this.isNeed) {
			this.openTemplate();
			this.setLabelLayer();
			this.getLowerCut();
			this.imposeLabels();
			this.closeTemplate();
		}
	},
};
