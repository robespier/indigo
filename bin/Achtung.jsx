#target Illustrator-13

#include "mc.jsx"

function achtung() {};
achtung.prototype = new mc(app);
achtung.prototype.constructor = achtung;

achtung.prototype.getLabels = function() {
	this.labels = []; // Массив из одной ссылки на объект файл (экземплярная переменная)
	achtung = new File ('Z:\\ACHTUNG.eps'); // Ссылка на объект файл
	this.labels.push(achtung);
	}
	
achtung.prototype.imposeLabels = function() {
	
	var myDoc = this.template;
	var achtungPlace = newlayer.placedItems.add();
	achtungPlace.file = this.labels[0]; //Помещаем на слой layer файл ACHTUNG.eps
	var targetPlace = new Array ((myDoc.width/2)-(achtungPlace.width/2), (myDoc.height/2)+(achtungPlace.height/2));

achtungPlace.position = targetPlace; //Выравниваем ахтунг по центру артбоарда

//Корректируем размеры ахтунга

var width_percent = (myDoc.width*88)/achtungPlace.width;
var height_percent = (myDoc.height*99)/achtungPlace.height;

achtungPlace.resize (width_percent, height_percent);

var fileName = this.jobFolder + '\\d' + this.task + '_ACHTUNG.pdf';
	this.exportPDF(fileName);
	}