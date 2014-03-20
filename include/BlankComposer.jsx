/**
 * @classdesc Создание бланка заказа
 * @constructor
 */
Indigo.BlankComposer = function() {};

Indigo.BlankComposer.prototype = new Indigo.BlankComposer();
Indigo.BlankComposer.prototype.constructor = Indigo.BlankComposer;

/**
 * @prop {string} name Имя воркера, используется в сообщениях класса <code>messenger</code>
 */
Indigo.BlankComposer.prototype.name = 'BlankComposer';

/**
 * <b>Пред-алга</b>
 *
 * @param {object} data Объект, параметризующий воркера
 */
Indigo.BlankComposer.prototype.setup = function(data) {
	this.dataInput = data;
};

/**
 * <b>Изменение/дополнение данных, пришедших их внешнего источника</b>
 *
 * <p>То, что не логично хранить в базе данных, можно навесить тут</p>
 */
Indigo.BlankComposer.prototype.dataMixin = function() {
	// Добавить текущую дату в формате 12.03.2014
	// todo: реализовать нормальный паддинг дат нулями
	var d = new Date();
	this.dataInput.date = d.getDate() + '.0' + (d.getMonth()+1) + '.' + d.getFullYear();
};

/**
 * <b>Заполняем бланк заказа</b>
 *
 * <p>Замысел:</br>
 *   сопоставить ключи объекта <code>dataInput</code> (который приехал из внешнего источника данных) </br>
 *   с именами полей в бланке заказа (аттрибуты 'name' объектов <code>TextFrame</code>, к ним можно обращаться по имени), </br>
 *   затем заполнить значения текстфреймов значениями из dataInput;</br>
 * </p>
 * <p>Однако:</br>
 *   если внедрять пустой бланк заказа на страницу с этикеткой, имена текстфреймов
 *   в бланке похерятся, и сопоставить их с ключами dataInput будет, увы, невозможно.
 * </p>
 * <p>Поэтому:</br>
 *   заполним бланк "в оригинале", пока имена текстфреймов доступны; </br>
 *   сохраним его во временной директории (<code>Folder.temp</code> -- это свойство <em>класса</em> <code>File</code>), </br>
 *     обычно это системная временная директория текущего пользователя Windows; </br>
 *   импортируем заполненный бланк в файл этикетки; </br>
 *   а по концовке работы скрипта удалим этот файл; </br>
 * </p>
 *
 * @throws Проблема с файловыми операциями
 */
Indigo.BlankComposer.prototype.fillBlank = function() {
	var blank = new File(Indigo.config.blankFile);
	var dataInput = this.dataInput;
	// Открываем бланк заказа
	try {
		app.open(blank);
	}
	// В случае ошибки освобождаем ресурсы
	// и кидаем своё исключение вышестоящим товарищам
	catch(e) {
		try {
			this.cleanup();
		}
		finally {
			throw {
				message: e.message,
				source: this.name,
				severity: 'error',
				jobid: this.dataInput._id
			};
		}
	}
	var blankDoc = app.activeDocument;
	var blankLayer = blankDoc.layers['blank'];
	// Заполняем бланк закака
	for (var key in dataInput) {
		if (dataInput.hasOwnProperty(key)) {
			// todo Логичнее (но не оптимальнее) вынести эту замену
			// в this.dataMixin()?
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

/**
 * <b>Открытие файла с этикеткой и сохранение его 
 * в экземплярной переменной объекта</b>
 *
 * <p>Имя файла приходит из внешнего источника данных</p>
 *
 * @throws Проблема с файловыми операциями
 */
Indigo.BlankComposer.prototype.openLabel = function() {
	this.labelFile = new File(this.dataInput.label);
	try {
		this.myDoc = app.open(this.labelFile);
	}
	catch(e) {
		try {
			this.cleanup();
		}
		finally {
			throw {
				message: e.message,
				source: this.name,
				severity: 'error',
				jobid: this.dataInput._id
			};
		}
	}
};

/**
 * <b>Экспорт заполненного бланк заказа</b>
 *
 * <p>Реализация по умолчанию -- экспорт в файл формата JPEG;</br>
 * Соответственно, в подклассах можно извратиться как угодно:
 * TIFF, BMP, выслать на e-mail, выложить на Фейсбук и т.п.</p>
 *
 * @throws Проблема с файловыми операциями
 */
Indigo.BlankComposer.prototype.exportBlank = function() {
	var fileSpec = new File(this.getJPEGName());
	var type = ExportType.JPEG;
	var exportOptions  = new ExportOptionsJPEG();
	exportOptions.antiAliasing = true;
	exportOptions.qualitySetting = 70;
	exportOptions.horizontalScale = 400;
	exportOptions.verticalScale = 400;

	try {
		this.myDoc.exportFile(fileSpec, type, exportOptions);
	}
	catch(e) {
		try {
			this.cleanup();
		}
		finally {
			throw {
				message: e.message,
				source: this.name,
				severity: 'error',
				jobid: this.dataInput._id
			};
		}
	}
};

/**
 * <b>Куда сохраняется заполненный бланк</b>
 *
 * @return {string} Полный путь к файлу
 */
Indigo.BlankComposer.prototype.getJPEGName = function() {
	return this.labelFile.fullName.replace('eps','jpg');
};

/**
 * <b>Печать бланка заказа</b>
 */
Indigo.BlankComposer.prototype.printBlank = function() {
	// var printOptions = new PrintOptions();
	// this.myDoc.print(printOptions);
	return 'Not Implemented Yet';
};

/**
 * <b>Разместить бланк относительно этикетки</b>
 */
Indigo.BlankComposer.prototype.placeBlank = function() {
	// Создаем слой для бланка, называем его именем blank 
	// и помещаем его в самый верх в пачке слоев документа
	var bLayer = this.myDoc.layers.add();
	bLayer.name = 'blank';
	bLayer.zOrder(ZOrderMethod.BRINGTOFRONT);

	// Определяем размещение бланка
	// Находим центр этикетки по контуру высечки
	var cutLayer = this.myDoc.layers['cut'];

	var cut_path = cutLayer.pathItems[0]; // Ссылка на контур высечки
	var cut_xPos = cut_path.position[0] + cut_path.width/2;
	var cut_yPos = cut_path.position[1] - cut_path.height/2;

	// Загружаем предварительно заполненный бланк из временной директории
	var blank_template = bLayer.placedItems.add();
	blank_template.file = this.tempBlank;

	// Определяем центр шаблона бланка
	var blank_xPos = cut_xPos - (blank_template.width/2);
	var blank_yPos = cut_yPos + (blank_template.height/3);
	// Внедряем бланк
	blank_template.position = new Array(blank_xPos, blank_yPos);
	blank_template.embed(); 
};

/**
 * <b>Зачистка хвостов, выполняется даже в случае аварийного завершения</b>
 *
 * <p>Нельзя однозначно сказать, доступны ли ресурсы, которые мы пытаеся 
 * освободить.</br>Вызов этого метода может произойти не в конце 
 * работы скрипта, а посередине, в каком-либо блоке <code>try/catch</code>;</p>
 * <p>Поэтому зачистку тоже оборачиваем в <code>try/catch</code>, чтобы
 * скрыть возможные ошибки.</p>
 */
Indigo.BlankComposer.prototype.cleanup = function() {
	try {
		// Закрываем этикетку без сохранения
		this.myDoc.close(SaveOptions.DONOTSAVECHANGES);
		// Удаляем заполненный бланк из временной директории
		this.tempBlank.remove();
	}
	catch(e) { }
};

/**
 * <b>Главная алга</b>
 */
Indigo.BlankComposer.prototype.run = function() {

	this.openLabel();
	this.dataMixin();
	this.fillBlank();
	this.placeBlank();
	this.exportBlank();
	this.printBlank();
	this.cleanup();

	// Отчитываемся перед веб-сервером:
	return true;
};
