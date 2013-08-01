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
 * Сгенерировать имя PDF для экспорта
 * @index int File number
 * @returns string
 */
achtung.prototype.getPDFName = function(index) {

	if (this.currentLabel instanceof File) {
		var child = this.currentLabel.parent;
	} else {
		var child = this.currentLabel.file.parent;
	}

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
	PDFName +='_ACHTUNG.pdf';
	// Путь для файла сборки
	return child + '\\' + PDFName;
}
