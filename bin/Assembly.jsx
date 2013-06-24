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
	var LsizeX = tc.width; //Определяем ширину единичного контура высечки
	var LsizeY = tc.height; //Определяем высоту единичного контура высечки
	for (i=0, l=this.labels.length; i < l; i++) {
		this.currentLabel = newlayer.placedItems.add();
		cl = this.currentLabel;
		cl.file = this.labels[i]; //Помещаем на слой layer файл этикетки
		clX = tc.position[0]+(LsizeX/2) - (cl.width/2);
		clY = tc.position[1]-(LsizeY/2) + (cl.height/2);
		cl.position = new Array (clX, clY); //Выравниваем этикетку по целевому контуру
		myStyle = this.getStyle();
		myStyle.applyTo(cl); // Применям графический стиль к этикетке
		this.exportPDF(this.getPDFName());
		cl.remove();
	}
}

/*
 * Логика определения намотки
 * Вызывается из getStyle.switch...
 * @returns boolean
 */
assembly.prototype.transform = function() {
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
 * @returns string
 */
assembly.prototype.getPDFName = function() {
	// Корень задания
	var PDFName = this.jobFolder + '\\'; //d' + this.task;
	// TODO Реальный номер этикетки
	labelNumber = 1;
	PDFName += labelNumber + '_';
	// Имя файла
	PDFName += this.currentLabel.file.name.replace ('eps', 'pdf');
	
	return PDFName;
}

/*
 * Экспорт готовой продукции
 * @returns void
 */
assembly.prototype.exportPDF = function(fileName) {
	var ResultFilePDF = new File (fileName);
	this.template.saveAs(ResultFilePDF, this.PDFSettings);
}
