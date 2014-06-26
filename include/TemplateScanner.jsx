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
	this.getTemplates();
	var templatesHeap = [];
	// Массив templates.length будет сокращаться на 1 с каждым
	// проходом цикла. Поэтому итератор написан схожим образом 
	for (var i = this.templates.length; i > 0; i--) {
		var t = this.openTemplate();
		var c = this.getLowerCut();
		templatesHeap.push({
			name: this.temp.name.replace('.ait',''),
			width: Indigo.round3(c.width),
			height: Indigo.round3(c.height),
		});
		t.close();
	}
	var results = {
		name: 'templatesList',
		data: templatesHeap,
	};
	return results;
};

/**
 * Создание массива шаблонов
 *
 * На рекурсию не замарачиваемся, предполагаем, что все  
 * шаблоны лежат в корне templateFolder с расширением .ait
 *
 * @throws {customException} Нет папки с шаблонами
 */
Indigo.TemplateScanner.prototype.getTemplates = function() {
	if (this.templateFolder.exists) {
		this.templates = this.templateFolder.getFiles('*.ait');
	} else {
		throw {
			message: 'Template folder not found',
			file: this.templateFolder.fullName,
			jobid: this.job._id,
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
