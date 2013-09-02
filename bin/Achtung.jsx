#target Illustrator-13

#include "mc.jsx"

function achtung() {};
achtung.prototype = new mc(app);
achtung.prototype.constructor = achtung;


achtung.prototype.imposeLabels = function() {

	var myDoc = this.template;

	this.achtung = new File ('Y:\\ACHTUNG.eps'); // Ссылка на объектную переменную типа файл
	var achtungPlace = newlayer.placedItems.add();
	achtungPlace.file = this.achtung; //Помещаем на слой layer файл ACHTUNG.eps
	var targetPlace = new Array ((myDoc.width/2)-(achtungPlace.width/2), (myDoc.height/2)+(achtungPlace.height/2));

	//Выравниваем ахтунг по центру артбоарда

	achtungPlace.position = targetPlace;

	//Корректируем размеры ахтунга

	var width_percent = (myDoc.width*88)/achtungPlace.width;
	var height_percent = (myDoc.height*99)/achtungPlace.height;

	achtungPlace.resize (width_percent, height_percent);

	this.currentLabel = this.labels[0];
	this.exportPDF(this.getPDFName());
	this.sendtoHotFolder(); // Кидаем сборку в горячую папку
}

/*
 * Возвращает имя файла для экспорта в PDF
 *
 * @param int index Номер файла
 * @param range string Диапазон папок
 * @returns string
 *
 */
achtung.prototype.getPDFPart = function(index, range, cName) {
	return this.child + '\\' + cName + range + '_ACHTUNG.pdf';
}
