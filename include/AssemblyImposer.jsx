/**
 * @classdesc Размещение этикеток на спуске
 * @constructor
 */
Indigo.AssemblyImposer = function() {};
Indigo.AssemblyImposer.prototype = new Indigo.BaseImposer(app);
Indigo.AssemblyImposer.prototype.constructor = Indigo.AssemblyImposer;

Indigo.AssemblyImposer.prototype.currentLabel = null;

/**
 * Получение ссылки на файл шаблона
 * @return {File} Файл шаблона
 */
Indigo.AssemblyImposer.prototype.getTemplateName = function () {
	var template = new File (this.templateFolder + '\\' + this.temp + '.ai');
	return template;
};

/**
 * Этот класс сборки делается в любом случае
 * @return {boolean}
 */
Indigo.AssemblyImposer.prototype.isNeed = function() {
	return true;
};

/**
 * Размещение этикетки на листе
 * (Применение графического стиля)
 * 
 * @return {void}
 */
Indigo.AssemblyImposer.prototype.imposeLabels = function() {
	var tc = this.targetCut;
	for (var i=0, l=this.labels.length; i < l; i++) {
		try {
			// Помещаем на слой layer файл этикетки
			this.placeLabel(tc, this.labels[i]);
			// Крутим
			this.applyStyle();
			this.exportPDF(this.getPDFName(i));
			this.sendtoHotFolder(); // Кидаем сборку в горячую папку
			this.currentLabel.remove();
		} catch (err) {
			// Continue flow
			$.writeln('Continue.AssemblyImposer.v3');
			var errobj = {
				message: err.message,
				source: 'AssemblyImposer',
				file: this.labels[i].fullName,
				severity: 'warning',
				jobid: this.job.id,
			};
			this.job.errors.push(errobj);
		}
	}
};

/**
 * Возвращает имя файла для экспорта в PDF
 *
 * @param {number} index Номер файла
 * @param {string} range Диапазон папок
 * @param {string} cName Чё за хрень не помню
 * @return {string} Имя файла
 */
Indigo.AssemblyImposer.prototype.getPDFPart = function(index, range, cName) {
	return this.child + '\\' + cName + this.child.name + '_' + this.currentLabel.file.name.replace ('eps', 'pdf');
};
