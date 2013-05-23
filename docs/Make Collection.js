//Make Collection
//Скрипт производит верстку файлов под Indigo WS 6000 на основе шаблона сборки.

#target illustrator-13

//Определяем переменные для паспорта. шаблона и намотки,
//которые задаются в окне диалога

var task = 5006006;
var temp = 4090354;
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

var templateFolder = new Folder ('D:\\work\\template');
var template = new File (templateFolder + '\\' + temp + '.ai');
app.open (template);

//Создаем слой для этикеток
//называем его именем label
//и помещаем его в самый низ в пачке слоев документа

newlayer = activeDocument.layers.add();
newlayer.name = 'label';
newlayer.zOrder(ZOrderMethod.SENDTOBACK);


//Определяем размер этикетки (без припусков)

var cuts = app.activeDocument.layers['cut'].pathItems;
var LsizeX = cuts[0].width;
var LsizeY = cuts[0].height;

//Обнуляем центр координат

var myDoc = app.activeDocument;
myDoc.rulerOrigin.pageOrigin;


//Находим левый нижний контур высечки

sumXY = new Array (cuts.length);

for (i=0; i < cuts.length; i++) {
var xPos = cuts[i].position[0] + (LsizeX/2);
var yPos = cuts[i].position[1] + (LsizeY/2);
sumXY[i] = xPos+yPos;

//alert (sumXY[i]);

}








//Проверяем правильной нахождения целевого объекта
//с помощью его удаления

//targetCut.remove();







//Считываем массив этикеток из print_list



//Закрываем активный документ

//var doc = app.activeDocument;
//doc.close (SaveOptions.DONOTSAVECHANGES);