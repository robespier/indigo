/**
 * @classdesc Создание бланка заказа
 * @constructor
 */
Indigo.BlankComposer = function() {};

Indigo.BlankComposer.prototype = new Indigo.BlankComposer();
Indigo.BlankComposer.prototype.constructor = Indigo.BlankComposer;

Indigo.BlankComposer.prototype.setup = function(data) {
	this.dataInput = data;
};

Indigo.BlankComposer.prototype.run = function() {
	var workFolder = new Folder ('D:\\work'); //Ссылка на рабочий каталог
	var blank = new File ('D:\\tmp\\blank.ai'); //Ссылка на файл blank.ai
	var etc = new File ('D:\\tmp\\spaklevka_08_klei.eps'); //Ссылка на файл этикетки

	var dataInput = this.dataInput;

	// Подмешиваем специфических данных
	// Текущая дата
	var d = new Date();
	dataInput.date = d.getDate() + '.0' + (d.getMonth()+1) + '.' + d.getFullYear();

	// Если внедрять пустой бланк заказа на страницу с этикеткой, имена TextFrame-ов
	// в бланке похерятся, и пройтись в цикле по ним будет уже невозможно.
	// Поэтому сохраняем заполненный бланк заказа во временной директории,
	// импортируем заполненный бланк и по концовке работы скрипта удалим его.
	// Открываем бланк заказа
	app.open(blank);
	var blankDoc = app.activeDocument;
	var blankLayer = blankDoc.layers['blank'];
	// Заполняем бланк заказа
	for (var key in dataInput) {
		if (dataInput.hasOwnProperty(key)) {
			if (typeof(dataInput[key]) === 'boolean') {
				dataInput[key] = dataInput[key] ? 'X' : ' ';
			}
			blankLayer.pageItems[key].contents = dataInput[key];
		}
	}
	var tempBlank = new File(Folder.temp + '\\blank_' + new Date().getTime() + '.ai');
	blankDoc.saveAs(tempBlank);
	blankDoc.close();
	
	// Открываем макет (файл этикетки)
	app.open (etc);	
	var myDoc = app.activeDocument; 
	// Создаем слой для бланка, называем его именем blank и помещаем его в самый верх в пачке слоев документа
	var bLayer = myDoc.layers.add();
	bLayer.name = 'blank';
	bLayer.zOrder(ZOrderMethod.BRINGTOFRONT);

	// Определяем размещение бланка
	// Находим центр этикетки по контуру высечки
	var cutLayer = myDoc.layers['cut'];

	var cut_path = cutLayer.pathItems[0]; // Ссылка на контур высечки
	var cut_xPos = cut_path.position[0] + cut_path.width/2;
	var cut_yPos = cut_path.position[1] - cut_path.height/2;

	// Загружаем предварительно заполненный бланк из временной директории
	var blank_template = myDoc.placedItems.add();
	blank_template.file = tempBlank;

	// Определяем центр шаблона бланка
	var blank_xPos = cut_xPos - (blank_template.width/2);
	var blank_yPos = cut_yPos + (blank_template.height/3);
	// Внедряем бланк
	blank_template.position = new Array (blank_xPos, blank_yPos);
	blank_template.embed(); 

	// Экспорт в jpg (рядом с этикеткой)
	var exportOptions  = new ExportOptionsJPEG();
	var type = ExportType.JPEG;
	var fileSpec = new File (etc.fullName.replace('eps','jpg'));
	exportOptions.antiAliasing = true;
	exportOptions.qualitySetting = 70;
	exportOptions.horizontalScale = 400;
	exportOptions.verticalScale = 400;
	myDoc.exportFile (fileSpec, type, exportOptions);

	// Закрываем этикетку без сохранения
	myDoc.close(SaveOptions.DONOTSAVECHANGES);

	// Удаляем заполненный бланк из временной директории
	tempBlank.remove();
};
