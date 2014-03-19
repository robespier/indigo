/**
 * @classdesc Создание бланка заказа
 * @constructor
 */
Indigo.BlankComposer = function() {};

Indigo.BlankComposer.prototype = new Indigo.BlankComposer();
Indigo.BlankComposer.prototype.constructor = Indigo.BlankComposer;

Indigo.BlankComposer.prototype.name = 'BlankComposer';

Indigo.BlankComposer.prototype.setup = function(data) {
	this.dataInput = data;
};

/**
 * Изменение/дополнения данных, пришедших их внешнего источника
 */
Indigo.BlankComposer.prototype.dataMixin = function() {
	// Добавить текущую дату в формате 12.03.2014
	// todo: реализовать нормальный паддинг дат нулями
	var d = new Date();
	this.dataInput.date = d.getDate() + '.0' + (d.getMonth()+1) + '.' + d.getFullYear();
};

/**
 * Заполняем бланк заказа
 *
 * Замысел:
 *   сопоставить ключи объекта dataInput (который приехал из внешнего источника данных) 
 *   с именами полей в бланке заказа (аттрибуты 'name' объектов TextFrame, к ним можно обращаться по имени), 
 *   затем заполнить значения текстфреймов значениями из dataInput;
 *
 * Однако:
 *   если внедрять пустой бланк заказа на страницу с этикеткой, имена текстфреймов 
 *   в бланке похерятся, и сопоставить их с ключами dataInput будет, увы, невозможно.
 *
 * Поэтому:
 *   заполним бланк "в оригинале", пока имена текстфреймов доступны; 
 *   сохраним его во временной директории (Folder.temp -- это свойство _класса_ File), 
 *     обычно это системная временная директория текущего пользователя Windows; 
 *   импортируем заполненный бланк в файл этикетки;
 *   а по концовке работы скрипта удалим этот файл;
 */
Indigo.BlankComposer.prototype.fillBlank = function() {
	var blank = new File (Indigo.config.blankFile);
	var dataInput = this.dataInput;
	// Открываем бланк заказа
	app.open(blank);
	var blankDoc = app.activeDocument;
	var blankLayer = blankDoc.layers['blank'];
	// Заполняем бланк закака
	for (var key in dataInput) {
		if (dataInput.hasOwnProperty(key)) {
			if (typeof(dataInput[key]) === 'boolean') {
				dataInput[key] = dataInput[key] ? 'X' : ' ';
			}
			// Заполняем только те поля, которые есть в бланке
			try {
				blankLayer.pageItems[key].contents = dataInput[key];
			}
			// Остальные свойства dataInput могут служить другим целям
			catch(e) {
				continue;
			}
		}
	}
	this.tempBlank = new File(Folder.temp + '\\blank_' + new Date().getTime() + '.ai');
	blankDoc.saveAs(this.tempBlank);
	blankDoc.close();
};

Indigo.BlankComposer.prototype.run = function() {

	this.dataMixin();
	this.fillBlank();

	var etc = new File (this.dataInput.label);

	// Открываем макет (файл этикетки)
	try {
		app.open (etc);
	}
	catch(e) {
		throw {
			message: e.message,
			source: this.name,
			severity: 'error',
			jobid: this.dataInput._id
		};
	}
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
	blank_template.file = this.tempBlank;

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
	this.tempBlank.remove();

	// Отчитываемся перед веб-сервером:
	return 0;
};
