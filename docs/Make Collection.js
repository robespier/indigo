//Make Collection
//Скрипт производит верстку файлов под Indigo WS 6000 на основе шаблона сборки.

#target illustrator-13

var task = 7267004; //Определяем переменные для паспорта 
var temp =1152418; //шаблона
var roll_number = 0; //и намотки, которые задаются в окне диалога или выцепляются из базы данных

//Рисуем окно диалога
//var dlg = new Window('dialog', 'Make Collection',[600,450,1000,750]);
//dlg.show();

var jobFolder = new Folder ('Z:\\d' + task); //Папка паспорта (рабочего каталога)

var prListFolder = new Folder ('D:\\work\\print_list'); //Папка, где находятся принт-листы
var prList = new File (prListFolder + '\\d' + task + '.csv'); //Ссылка на файл принт-листа
var printList = []; //Массив строк из принт-листа




var templateFolder = new Folder ('D:\\work\\template'); //Каталог шаблонов сборки
var template = new File (templateFolder + '\\' + temp + '.ai'); //Ссылка на файл шаблона
app.open (template); //Открываем шаблон

newlayer = activeDocument.layers.add(); //Создаем слой для размещения этикеток
newlayer.name = 'label'; //называем его именем label
newlayer.zOrder(ZOrderMethod.SENDTOBACK); //и помещаем его в самый низ в пачке слоев документа

var myDoc = app.activeDocument; //Создаем ссылку на активный документ
myDoc.rulerOrigin = [0,0]; //Обнуляем центр координат

var cuts = myDoc.layers['cut'].pathItems; //Создаем ссылку на массив высечек

var LsizeX = cuts[0].width; //Определяем ширину единичного контура высечки
var LsizeY = cuts[0].height; //Определяем высоту единичного контура высечки

//Находим левый нижний контур высечки

sumXY = new Array (cuts.length); //Cоздаем массив, в котором сохраняем сумму X и Y-позиций всех элементов массива высечек.
for (i=0; i < cuts.length; i++) {
	var xPos = cuts[i].position[0];
	var yPos = cuts[i].position[1];
	sumXY[i] = xPos+yPos;
}

var target_index = 0; ////Находим индекс мин. значения массива
target_sum = sumXY[0];

for (i=0; i<sumXY.length;i++) {
	if (sumXY[i] <= target_sum) {
		target_index = i;
		target_sum = sumXY[i];
	}
}

var targetCut = cuts[target_index]; //Определяем целевой контур

prList.open(); //Открываем принт-лист

var myRolls = myDoc.graphicStyles; // Считываем массив намоток (графических стилей) документа

var PDFSettings = new PDFSaveOptions(); // Настройки экспорта в PDF
PDFSettings.acrobatLayers = false;

while (line=prList.readln()) {
	printList.push(line); //Считываем одну строку из print_list

	var file_parts = line.split(";");
	file_parts[0]; //Берем из строки номер этикетки
	file_parts[1]; //Берем из строки наименование этикетки

	file_name = jobFolder + '\\' + file_parts[1];
	var labelObjectFile= new File (file_name); //Создаем ссылку на файл этикетки

	var label = newlayer.placedItems.add();

	label.file = labelObjectFile; //Помещаем на слой layer файл этикетки
	label.position = new Array (targetCut.position[0]+(LsizeX/2) - (label.width/2), targetCut.position[1]-(LsizeY/2)+(label.height/2));

	//  Выбор намоток
	switch(roll_number) {
		case 0:
			// Ручная намотка
			// ПРЯМОУГОЛЬНАЯ ЭТИКЕТКА
			// 1 - квадрат, крутить не надо;
			// 0.999 ширина меньше высоты, крутим в любую сторону на 90 градусов
			// 1.999 ширина больше высоты, крутить не надо
			targetCutRate = targetCut.width/targetCut.height;
			labelRate = label.width/label.height;

			if (((targetCutRate < 1) && (labelRate > 1)) || ((targetCutRate > 1) && (labelRate < 1)))  {
				myStyle=myRolls['roll_1_6']; // Крутить
			} else {
				myStyle=myRolls['roll_4_8']; // Не крутить
			}
			break;
		case 1:
			break;
		default:
			alert ('No such roll');
			break;
	}

	//
	myStyle.applyTo(label); // Применям графический стиль к этикетке

	// Экспорт в PDF
	var PDFName = jobFolder + '\\d' + task + '_'  + file_parts[0] + '_' + file_parts[1].replace ('eps', 'pdf'); //Задаем имя файла сборки
	var ResultFilePDF = new File (PDFName);
	//	myDoc.saveAs(ResultFilePDF, PDFSettings); //Сохраняем файл сборки

	label.remove(); // Удаляем объект label
}

prList.close();

//Закрываем активный документ
myDoc.close (SaveOptions.DONOTSAVECHANGES);


//////////////////////////////////////////////////////////////////////////////////////////
//
//
//
//
// Делаем сборку-утверждение
//
//
//

var template_utv = new File (templateFolder + '\\short\\' + temp + '_short.ai'); //Ссылка на файл короткого шаблона

app.open (template_utv); //Открываем короткий шаблон

newlayer = activeDocument.layers.add(); //Создаем слой для размещения этикеток
newlayer.name = 'label'; //называем его именем label
newlayer.zOrder(ZOrderMethod.SENDTOBACK); //и помещаем его в самый низ в пачке слоев документа

var myDoc = app.activeDocument; //Создаем ссылку на активный документ
myDoc.rulerOrigin = [0,0]; //Обнуляем центр координат

var cuts = myDoc.layers['cut'].pathItems; //Создаем ссылку на массив высечек

prList.open(); //Открываем принт-лист

var i=0;

while (line=prList.readln()) {
	printList.push(line); //Считываем одну строку из print_list

	var file_parts = line.split(";");
	file_parts[0]; //Берем из строки номер этикетки
	file_parts[1]; //Берем из строки наименование этикетки

	file_name = jobFolder + '\\' + file_parts[1];
	var labelObjectFile= new File (file_name); //Создаем ссылку на файл этикетки

	var label = newlayer.placedItems.add();

	label.file = labelObjectFile; //Помещаем на слой layer файл этикетки

	label.position = new Array (cuts[i].position[0]+(LsizeX/2) - (label.width/2), cuts[i].position[1]-(LsizeY/2)+(label.height/2));

	//  Выбор намоток
	switch(roll_number) {
		case 0:
			// Ручная намотка
			// ПРЯМОУГОЛЬНАЯ ЭТИКЕТКА
			// 1 - квадрат, крутить не надо;
			// 0.999 ширина меньше высоты, крутим в любую сторону на 90 градусов
			// 1.999 ширина больше высоты, крутить не надо
			targetCutRate = cuts[i].width/cuts[i].height;
			labelRate = label.width/label.height;

			if (((targetCutRate < 1) && (labelRate > 1)) || ((targetCutRate > 1) && (labelRate < 1)))  {
				myStyle=myRolls['roll_1_6']; // Крутить
			} else {
				myStyle=myRolls['roll_4_8']; // Не крутить
			}
			break;
		case 1:
			break;
		default:
			alert ('No such roll');
			break;
	}

	myStyle.applyTo(label); // Применям графический стиль к этикетке
	i++;
}

prList.close();

// Экспорт в PDF
// d + 7267004 + _UTV.pdf
var PDFName = jobFolder + '\\d' + task + '_UTV.pdf'; //Задаем имя файла сборки
var ResultFilePDF = new File (PDFName);
myDoc.saveAs(ResultFilePDF, PDFSettings); //Сохраняем файл сборки

//Закрываем активный документ
myDoc.close (SaveOptions.DONOTSAVECHANGES);

//////////////////////////////////////////////////////////////////////////////////////////
//
//
//
//
//Делаем сборку-внимание


