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
	tc = this.targetCut;
	var LsizeX = tc.width; //Определяем ширину единичного контура высечки
	var LsizeY = tc.height; //Определяем высоту единичного контура высечки
	var i = 0;
	var l = labelsCount;
	var utvCount = 1;
	while (labelsCount > 0) {
		newlayer.placedItems.removeAll();
		for (i,k=0; i < l && k < cutsCount; k++, i++) {
			this.currentLabel = newlayer.placedItems.add();
			cl = this.currentLabel;
			cl.file = this.labels[i]; //Помещаем на слой layer файл этикетки
			clX = cuts[k].position[0]+(LsizeX/2) - (cl.width/2),
			clY = cuts[k].position[1]-(LsizeY/2) + (cl.height/2);
			cl.position = new Array (clX, clY); //Выравниваем этикетку по целевому контуру
			myStyle = this.getStyle();
			myStyle.applyTo(cl); // Применям графический стиль к этикетке
		}
		labelsCount -= cutsCount;
		this.exportPDF(this.getPDFName(utvCount));
		utvCount++;
	}
}

/*
 * Логика определения намотки
 * Вызывается из getStyle.switch...
 * @returns boolean
 */
matching.prototype.transform = function() {
	// Ручная намотка
	// ПРЯМОУГОЛЬНАЯ / ОВАЛЬНАЯ ЭТИКЕТКА
	// 1 - квадрат, крутить не надо;
	// 0.999 ширина меньше высоты, крутим на -90 градусов
	// 1.999 ширина больше высоты, крутить не надо
	targetCutRate = this.targetCut.width/this.targetCut.height;
	labelRate = this.currentLabel.width/this.currentLabel.height;
	return (((targetCutRate < 1) && (labelRate > 1)) || ((targetCutRate > 1) && (labelRate < 1)));
}

/*
 * Сгенерировать имя PDF для экспорта
 * @index int File number
 * @returns string
 */
matching.prototype.getPDFName = function(index) {
	// d + 7267004 + _UTV.pdf
	// Корень задания
	var PDFName = this.jobFolder + '\\'; //d' + this.task;
	// Имя файла
	PDFName += 'd' + this.temp.replace('_short','') + '_UTV_' + index.toString() + '.pdf';
	
	return PDFName;
}
