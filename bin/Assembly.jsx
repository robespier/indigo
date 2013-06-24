#target Illustrator-13

#include "mc.jsx"

function assembly() {};
assembly.prototype = new mc(app);
assembly.prototype.constructor = assembly;

assembly.prototype.currentLabel = null;

/*
 * Размещение этикетки на листе
 * (Применение графического стиля)
 * @returns void
 */
assembly.prototype.imposeLabels = function() {
	tc = this.targetCut;
	for (i=0, l=this.labels.length; i < l; i++) {
		// Помещаем на слой layer файл этикетки
		this.placeLabel(tc, this.labels[i]);
		// Крутим
		this.applyStyle();
		this.exportPDF(this.getPDFName(i));
		this.currentLabel.remove();
	}
}

/*
 * Сгенерировать имя PDF для экспорта
 * @param index -- label number in printlist
 * @returns string
 */
assembly.prototype.getPDFName = function(index) {
	// Корень задания
	var PDFName = this.jobFolder + '\\';
	// Номер этикетки
	labelNumber = index + 1;
	PDFName += labelNumber.toString() + '_';
	// Имя файла
	PDFName += this.currentLabel.file.name.replace ('eps', 'pdf');
	
	return PDFName;
}
