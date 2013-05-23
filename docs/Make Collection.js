//Make Collection
//Скрипт производит верстку файлов под Indigo WS 6000 на основе шаблона сборки.

#target illustrator-13

//Определяем переменные для паспорта. шаблона и намотки,
//которые задаются в окне диалога

var task = 5006006;
var temp =4090354;
var roll = 0;

	//Рисуем окно диалога
	//var dlg = new Window('dialog', 'Make Collection',[600,450,1000,750]);
	//dlg.show();

//Определяем переменные для рабочего каталога и папки паспорта

var jobFolder = new Folder ('\\exchange1\\DESIGN_IBM');
var taskFolder = new Folder (jobFolder + '\\d' + task);


//Определяем переменные для принт-листа:
//папку, где будет находится принт-лист
//и ссылку на файл принт-листа

var prListFolder = new Folder ('D:\\work\\print_list');
var prList = new File (prListFolder + '\\d' + task + '.csv');


//Определяем переменную для каталога шаблонов сборки
//и ссылку на файл шаблона
//а также открываем шаблон

var templateFolder = new Folder ('D:\\work\\template\\short');
var template = new File (templateFolder + '\\' + temp + '_short.ai');
app.open (template);

//Создаем слой для этикеток
//называем его именем label
//и помещаем его в самый низ в пачке слоев документа

newlayer = activeDocument.layers.add();
newlayer.name = 'label';
newlayer.zOrder(ZOrderMethod.SENDTOBACK);

//Обнуляем центр координат

var myDoc = app.activeDocument;
myDoc.rulerOrigin = [0,0];

//Создаем ссылку на массив высечек

var cuts = app.activeDocument.layers['cut'].pathItems;

//Определяем размер единичного контура

//var LsizeX = cuts[0].width;
//var LsizeY = cuts[0].height;

			//Находим левый нижний контур высечки

//Cоздаем массив, в котором сохраняем сумму X и Y-позиций
//всех элементов массива высечек.

sumXY = new Array (cuts.length);
for (i=0; i < cuts.length; i++) {
	var xPos = cuts[i].position[0];
	var yPos = cuts[i].position[1];
sumXY[i] = xPos+yPos;
}

//Находим индекс мин. значения массива

var target_index = 0;
target_sum = sumXY[0];

for (i=0; i<sumXY.length;i++) {
	if (sumXY[i] <= target_sum) {
		target_index = i;
		target_sum = sumXY[i];
		}
	}

//Определяем целевой контур

var targetCut = cuts[target_index];

//Проверяем правильной нахождения целевого объекта
//с помощью его удаления

targetCut.remove();







//Считываем массив этикеток из print_list



//Закрываем активный документ

//var doc = app.activeDocument;
//doc.close (SaveOptions.DONOTSAVECHANGES);