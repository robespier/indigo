/**
 * @classdesc Сканирование папки шаблонов с целью создания базы в монго
 * @constructor
 */
Indigo.TemplateScanner = function() {};
Indigo.TemplateScanner.prototype = new Indigo.BaseImposer(app);
Indigo.TemplateScanner.prototype.constructor = Indigo.TemplateScanner;

Indigo.TemplateScanner.prototype.currentLabel = null;
Indigo.TemplateScanner.prototype.name = 'TemplateScanner';

/**
 * Реализация run() из BaseImposer
 *
 * @return {Object} result Список имён шаблонов с размерами этикетки
 */
Indigo.TemplateScanner.prototype.run = function () {
	// Размер буфера, по умолчанию 50	
	var chunkSize = this.chunkSize ? this.chunkSize : 50;
	
	// Заполнение массива шаблонов
	this.getTemplates();

	var templatesHeap = [],
		affected = this.templates.length;

	//
	// Передача промежуточных результатов 
	//
	function sendChunk(piece) {
		var success = true;
		try {
			this.send('running',piece);
		} catch (e) {
			success = false;
		}
		return success;
	}

	// Массив templates.length будет сокращаться на 1 с каждым
	// проходом цикла. Поэтому итератор написан схожим образом.
	// Каждые `chunkSize` проходов цикла будет происходить сброс 
	// результатов в базу.
	for (var i = this.templates.length, chsz = 1; i > 0; i--, chsz++) {
		var t = this.openTemplate();
		
		var info = {};
		info.name = this.temp.name.replace(this.tempExt,'');
		// Убираем первый слэш из имени, второй заменяем двоеточием:
		// /d/work/template -> d:/work/template
		info.path = this.temp.fullName.replace(/^\/(.)/,"$1:");
	
		var valid = this.validate();
		if (valid.length > 0) {
			info.status = 'error';
			info.errors = valid;
		} else {
			var c = this.getLowerCut();
			info.width = Indigo.round3(c.width);
			info.height = Indigo.round3(c.height);
			info.status = 'done';
		}
		templatesHeap.push(info);
		t.close();

		if (chsz >= chunkSize) {
			chsz = 0;
			if (sendChunk.call(this, templatesHeap)) {
				templatesHeap = [];
			}
		}
	}
	// Добиваем остатки, если есть
	if (templatesHeap.length > 0) {
		sendChunk.call(this, templatesHeap);
	}

	return {completed: 'victory', affected: affected};
};

/**
 * aihint для шаблона
 * 
 * проверка наличия необходимых слоёв и графических стилей
 *
 * @return {array} errors 
 */
Indigo.TemplateScanner.prototype.validate = function () {
	var t = this.template;
	var errors = [];

	if (t.layers.length > 2) {
		errors.push('More than two layers in template');
	}
	var expectedLayers = ['cut', 'mark'];
	for (var il = 0, ll = expectedLayers.length; il < ll; il++) {
		try {
			var expectedLayer = t.layers[expectedLayers[il]];
		} catch (e) {
			errors.push('No "' + expectedLayers[il] + '" layer in template');
		}
	}

	if (t.graphicStyles.length !== 6) {
		errors.push('Rolls unstable');
	}
	var expectedStyles = ['roll_1_6', 'roll_2_5', 'roll_3_7', 'roll_4_8'];
	for (var is = 0, ls = expectedStyles.length; is < ls; is++) {
		try {
			var expectedStyle = t.graphicStyles[expectedStyles[is]];
		} catch (e) {
			errors.push('Roll "' + expectedStyles[is] + '" absent');
		}
	}
	return errors;
};

/**
 * Создание массива шаблонов
 *
 * На рекурсию не замарачиваемся, предполагаем, что все  
 * шаблоны лежат в корне templateFolder с расширением .ait
 *
 * Шаблоны, которые уже есть в базе отфильтровываются
 *
 * @throws {customException} Нет папки с шаблонами
 */
Indigo.TemplateScanner.prototype.getTemplates = function() {
	if (this.templateFolder.exists) {
		// Все шаблоны с диска:
		var whole = this.templateFolder.getFiles('*' + this.tempExt).sort();
		// Массив шаблонов, которые уже обработаны:
		var ready = this.job.templates.sort();
		// Отфильтрованный массив шаблонов:
		var todo = [];

		for (var i = 0, l = whole.length; i < l; i++) {
			var name = whole[i].name.replace(this.tempExt,'');
			if (!ready.contains(name)) {
				todo.push(whole[i]);
			}
		}
		this.templates = todo;
	} else {
		throw {
			message: 'Template folder not found',
			file: this.templateFolder.fullName,
			src: 'getTemplates',
		};
	}
};

/**
 * Получение файла шаблона из массива шаблонов
 * Реализация getTemplateName() из BaseImposer
 *
 * @return {File} Файл шаблона
 */
Indigo.TemplateScanner.prototype.getTemplateName = function() {
	var t = this.templates.shift();
	// Сохраним текущий шаблон в экземплярной переменной,
	// чтобы в дальнейшем получить с него имя
	this.temp = t;
	return t;
};
