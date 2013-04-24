//Make Collection
//Скрипт производит верстку файлов под Indigo WS 6000 на основе шаблона сборки.

#target illustrator-13

//Задаем переменные для паспорта. шаблона и намотки
var task = 5006006;
var temp = 4090354;
var roll = 2;

	//Рисуем окно диалога
	//var dlg = new Window('dialog', 'Make Collection',[600,450,1000,750]);
	//dlg.show();

	//alert ('В окне диалога Make Collection вводятся номер задания,
	//\nномер шаблона высечки, а также выбирается тип намотки.');



//Проверяем наличие папки паспорта (в jobcontainer)
//В случае отсутствия, выдаем сообщение: "Указанный паспорт не найден"

var jobFolder = new Folder ('\\exchange1\DESIGN_IBM');
var taskFolder = new Folder (jobFolder + '\\d' + task + '.csv');



//Проверяем наличие принт-листа (файл с номером паспорта в базе принт-листов)
//В случае отсутствия, выдаем сообщение: "Принт-лист не найден "

var prListFolder = new Folder ('D:\\work\\print_list');
var prList = new File (prListFolder + '\\d' + task + '.csv');


//Проверяем соответствие...



//Проверяем наличие указанного шаблона сборки (в базе шаблонов)
//Если шаблон существует, открываем его
//В противном случае - выдаем сообщение: "Указанный шаблон отсутствует в базе шаблонов"

var templateFolder = new Folder ('D:\\work\\template');
var template = new File (templateFolder + '\\' + temp + '.ai');

// domelaz path
//var template = new File ('D:\\tmp\\Test.ai');

app.open (template);

//Находим левый нижний контур высечки (целевой контур)

// allCuts -- массив элементов PathItems (высечек, по человечески)
var allCuts = app.activeDocument.layers[1].pathItems;
// targetCut -- указатель на какую-то высечку в массиве allCuts
var targetCut = allCuts[0];

// 	element.position[0] - левый x, position[1] - верхний y; 
// 	Начало координат - нижний левый угол страницы
for (i=1; i<allCuts.length; i++) {
	// checkout - стоит ли перемещать указатель на другую высечку
	checkout = false;
	if (targetCut.position[1] >= allCuts[i].position[1]) {
		// элемент ниже указаетеля или вровень с  ним
		// надо двигать
		checkout = true;
		if ((targetCut.position[0] < allCuts[i].position[0]) && targetCut.position[1] == allCuts[i].position[1]) {
			checkout = false;
		}
	}
	if (checkout) {
		targetCut = allCuts[i];
	}
}
//	testY = allCuts[i].position[1] - allCuts[i].height;
targetCut.remove();

//Сохраняем координаты целевого контура

//Сохраняем размеры этикетки с припусками (размеры целевого контура + 2 мм)

//Считать массив этикеток из print_list










