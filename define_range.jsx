// Данный скрипт, по-сути, допиливание метода getPDFName.
// Не хочу ломать работоспособный код, которым пользуюсь
// каждый день, посему сначала решил переписать этот кусок,
// а в случае удачного исхода вставить его в код.

// Исходный код такой:
/*
getPDFName: function(index) {

	if (this.currentLabel instanceof File) {
		this.child = this.currentLabel.parent;
	} else {
		this.child = this.currentLabel.file.parent;
	}

	var mother = this.child.parent;
	var father = mother.parent;
	
		// Определяем диапазон папок 
	var targetName = [];
	for (i=0, l=this.labels.length; i < l; i++) {
		targetName[i]= this.labels[i].parent.name;
	}

	targetName.sort();

	this.range = targetName[0] + '_' + targetName[targetName.length-1];
	
	var NamePart = this.getNamePart(index);
	var PDFName = father.name + mother.name;
	return PDFName + NamePart;
	},
*/

// Не устраивает меня то, что если значения элементов массива targetName
// будут одинаковы, то this.range должно быть равным targetName[0],
// а не как сейчас (строка 27).


	
	var targetName = ['061','062','063','064'];

if (targetName.length == 1) {
	var range = targetName[0];
	
// Если массив из одного значения, то range равен ему.
// в противном случае, мы проверяем на уникальность все элементы массива

} else {
		
	targetName.sort();
	var unique;
	
	for (i=1, l=targetName.length; i < l; i++) {
		if (targetName[0] == targetName[i]) {
			unique = 0;			
		} else {
			unique = 1;
		}		
	}

	if (unique < 1) {
	var range = targetName[0];
// если уникальность равна нулю, значит элементы  targetName одинаковые
// и range будет представлен одним числом,
// в противном случае, элементы  targetName - разные, тогда range будет составной.
		} else {
	var range = targetName[0] + '_' + targetName[targetName.length-1];			
	}
}

alert (range);
	
// Осталось только сделать рефакторинг и можно вставлять в код.

	
