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
	for (i=0, l=this.labels.length; i < l; i++) {
		// Помещаем на слой layer файл этикетки
		this.placeLabel(tc, this.labels[i]);
		// Крутим
		this.applyStyle();
		this.exportPDF(this.getPDFName(i));
		this.sendtoHotFolder(); // Кидаем сборку в горячую папку
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
	var child =  this.currentLabel.file.parent;
	var mother = child.parent;
	var father = mother.parent;
	var PDFName = father.name + mother.name + child.name;

	// Имя файла сборки
	PDFName +='_' + this.currentLabel.file.name.replace ('eps', 'pdf');
	return child + '\\' + PDFName;
}

