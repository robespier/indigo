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
		this.sendtoHotFolder(); // Кидаем сборку в горячую папку
		utvCount++;
	}
}

/*
 * Сгенерировать имя PDF для экспорта
 * @index int File number
 * @returns string
 */
matching.prototype.getPDFName = function(index) {

	// 
	var child =  this.currentLabel.file.parent;
	var mother = child.parent;
	var father = mother.parent;

	// Определяем диапазон папок 
	var targetName = [];
	for (i=0, l=this.labels.length; i < l; i++) {
		targetName[i]= this.labels[i].parent.name;
	}

	targetName.sort();

	range = targetName[0] + '_' + targetName[targetName.length-1];

	var PDFName = father.name + mother.name + range;	


	// Имя файла сборки
	PDFName +='_UTV_' + index.toString() + '.pdf';
	// Путь для файла сборки
	return  this.labels[0].parent + '\\' + PDFName;
}
