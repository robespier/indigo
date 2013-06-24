#target Illustrator-13

#include "mc.jsx"

function matching() {};
matching.prototype = new mc(app);
matching.prototype.constructor = matching;

matching.prototype.currentLabel = null;

/*
 * Размещение этикетки на листе
 * (Применение графического стиля)
 * @returns void
 */
matching.prototype.imposeLabels = function() {
	var cuts = this.template.layers['cut'].pathItems;
	var cutsCount = cuts.length;
	var labelsCount = this.labels.length;
	var i = 0;
	var l = labelsCount;
	var utvCount = 1; // Счетчик имен сборок-утверждений
	while (labelsCount > 0) {
		newlayer.placedItems.removeAll();
		for (i,k=0; i < l && k < cutsCount; k++, i++) {
			// Помещаем на слой layer файл этикетки
			this.placeLabel(cuts[k], this.labels[i]);
			// Крутим
			this.applyStyle();
		}
		labelsCount -= cutsCount;
		this.exportPDF(this.getPDFName(utvCount));
		utvCount++;
	}
}

/*
 * Сгенерировать имя PDF для экспорта
 * @index int File number
 * @returns string
 */
matching.prototype.getPDFName = function(index) {
	// d + 7267004 + _UTV.pdf
	// Корень задания
	var PDFName = this.jobFolder + '\\'; 
	// Имя файла
	PDFName += 'd' + this.temp.replace('_short','') + '_UTV_' + index.toString() + '.pdf';
	
	return PDFName;
}
