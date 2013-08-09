#target Illustrator-13

#include "mc.jsx"

function assembly() {};
assembly.prototype = new mc(app);
assembly.prototype.constructor = assembly;

assembly.prototype.currentLabel = null;

assembly.prototype.getTemplateName = function () {
	var template = new File (this.templateFolder + '\\' + this.temp + '.ai');

	return template;
}


/*
 * Размещение этикетки на листе
 * (Применение графического стиля)
 * @returns void
 */
assembly.prototype.imposeLabels = function() {
	tc = this.targetCut;
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
			$.writeln('Continue assembly v3')
			var errobj = {
				message: err.message,
				source: 'assembly',
				file: this.labels[i].fullName,
				severity: 'warning',
				jobid: this.job.dbid,
			}
			this.job.errors.push(errobj);
		}
	}
}

/*
 * Возвращает имя файла для экспорта в PDF
 *
 * @param int index Номер файла
 * @param range string Диапазон папок
 * @returns string
 *
 */
assembly.prototype.getPDFPart = function(index, range, cName) {
	return this.child + '\\' + cName + this.child.name + '_' + this.currentLabel.file.name.replace ('eps', 'pdf');
}
