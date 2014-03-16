#target Illustrator-13

#include "mc.jsx"

function lacquer() {};
lacquer.prototype = new mc(app);
lacquer.prototype.constructor = lacquer;

lacquer.prototype.currentLabel = null;

lacquer.prototype.getTemplateName = function () {
		var template = new File (this.templateFolder + '\\lak\\' + this.temp + '_lak' + '.ai'); //Ссылка на файл шаблона

	return template;
}


/*
 * Размещение этикетки на листе
 * (Применение графического стиля)
 * @returns void
 */
lacquer.prototype.imposeLabels = function() {
	tc = this.targetCut;
	for (var i=0, l=this.labels.length; i < l; i++) {
		// Помещаем на слой layer файл этикетки
		this.placeLabel(tc, this.labels[i]);
		// Крутим
		this.applyStyle();
		
textMark = app.activeDocument.layers['mark'].textFrames[0];
d = new Date();
date = d.getDate() + '.' + (d.getMonth()+1) + '.' + d.getFullYear();
lakText = this.getPDFName(i);
textMark.contents = lakText.replace ('eps', 'pdf') + '_' + date;

		this.exportPDF(this.child + '\\' + this.getPDFName(i));

		this.currentLabel.remove();
	}
}

lacquer.prototype.getNamePart = function() {
	NamePart = this.child.name + '_' + this.currentLabel.file.name.replace ('eps', 'pdf');
	return NamePart;
}

