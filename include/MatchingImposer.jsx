/**
 * @classdesc Сборка "Утверждение".
 * Размещение всех этикеток задания на одном печатном листе
 * @constructor
 */
Indigo.MatchingImposer = function() {};
Indigo.MatchingImposer.prototype = new Indigo.BaseImposer(app);
Indigo.MatchingImposer.prototype.constructor = Indigo.MatchingImposer;

Indigo.MatchingImposer.prototype.currentLabel = null;

/**
 * Размещение этикеток на листе. 
 * Если этикеток в задании больше, чем высекальных контуров в шаблоне, 
 * то необходимо создавать несколько сборок-утверждений. 
 * К примеру, если контуров 8, а этикеток 6 - создаётся одна сборка; 
 * Если контуров 8, а этикеток 12 - создаётся две сборки. 
 * В связи с этим сборки нумеруются по схеме UTV_1, UTV_2, и.т.д;
 *
 * @throws {customException} Нет файла этикетки
 * @return {void}
 */
Indigo.MatchingImposer.prototype.imposeLabels = function() {

	var cuts = this.template.layers['cut'].pathItems;
	var cutsCount = cuts.length;
	var labelsCount = this.labels.length;
	var l = labelsCount;
	var i = 0;
	// Счетчик имен сборок-утверждений
	var utvCount = 1;
	while (labelsCount > 0) {
		this.labelLayer.placedItems.removeAll();
		for (var k=0; i < l && k < cutsCount; k++, i++) {
			try {
				// Помещаем на слой layer файл этикетки
				this.placeLabel(cuts[k], this.labels[i]);
				// Крутим
				this.applyStyle();
			} catch (e) {
				// interrupt normal flow
				throw {
					message: e.message,
					source: 'MatchingImposer',
					file: this.labels[i].fullName,
					severity: 'error',
					jobid: this.job.id,
				};
			}
		}
		labelsCount -= cutsCount;

		// Экспорт сборки на сервер
		this.exportPDF(this.getPDFName(utvCount));
		 
		// Экспорт сборки в горячую папку на RIP
		this.sendtoHotFolder();
		utvCount++;
	}
};

/**
 * Возвращает имя файла для экспорта в PDF
 * Сборка должна падать в папку с первой этикеткой задания
 *
 * @param {number} index Номер файла
 * @param {string} range Диапазон папок
 * @param {string} cName Чё за хрень не помню
 * @return {string} Имя файла
 */
Indigo.MatchingImposer.prototype.getPDFPart = function(index, range, cName) {
	return this.labels[0].parent + '\\' + cName + range + '_UTV_' + index.toString() + '.pdf';
};
