/**
 * @classdesc "Разбивает" разные задания в тираже привлекающей 
 * внимание надписью. Печатнику легче ориентироваться. Человеческий 
 * фактор нервно курит в сторонке.
 * @constructor
 */
Indigo.AchtungImposer = function() {};
Indigo.AchtungImposer.prototype = new Indigo.BaseImposer(app);
Indigo.AchtungImposer.prototype.constructor = Indigo.AchtungImposer;

Indigo.AchtungImposer.prototype.name = 'AchtungImposer';
/**
 * @prop {string} achtungLabel Путь к файлу "Внимание..."
 */
Indigo.AchtungImposer.prototype.achtungLabel = Indigo.config.achtungFile;

/** 
 * Размещение этикетки на листе.
 * В данном случае this.labels идёт лесом, мы ставим единственный
 * файл (ACHTUNG.eps) по центру печатного листа и масштабируем его
 * до максимально возможного размера
 *
 * @return {void}
 */
Indigo.AchtungImposer.prototype.imposeLabels = function() {

	var template = this.template;
	// Помещаем на слой layer файл ACHTUNG.eps
	var achtungPlace = this.labelLayer.placedItems.add();
	achtungPlace.file = new File (this.achtungLabel);
	
	// Выравниваем ахтунг по центру артбоарда
	var targetPlace = new Array (
		(template.width / 2) - (achtungPlace.width / 2),
		(template.height / 2) + (achtungPlace.height / 2)
	);
	achtungPlace.position = targetPlace;

	// Корректируем размеры ахтунга
	// Предупреждение должно занимать почти весь лист, но с учётом меток
	// Опытным путём получены такие пропорции: 99% от высоты листа, 88% от ширины его
	var HeightRatioPercent = 99;
	var WidthRatioPercent = 88;
	var width_percent = (template.width * WidthRatioPercent) / achtungPlace.width;
	var height_percent = (template.height * HeightRatioPercent) / achtungPlace.height;
	achtungPlace.resize (width_percent, height_percent);

	// Здесь currentLabel необходим для того, чтобы Ахтунг упал 
	// в нужное место (туда, где лежит первая этикетка задания)
	this.currentLabel = this.labels[0];
	
	// Экспорт сборки на сервер
	this.exportPDF(this.getPDFName());
	
	// Экспорт сборки в горячую папку на RIP
	this.sendtoHotFolder();
};

/**
 * Возвращает имя файла для экспорта в PDF. 
 * Сборка должна падать в папку с первой этикеткой задания
 *
 * @param {number} index Номер файла
 * @param {range} string Диапазон папок
 * @param {string} cName Чё за хрень не помню
 * @return {string}
 */
Indigo.AchtungImposer.prototype.getPDFPart = function(index, range, cName) {
	return this.child + '\\' + cName + range + '_ACHTUNG.pdf';
};
