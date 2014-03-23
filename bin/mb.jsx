#target Illustrator-13

app.userInteractionLevel = UserInteractionLevel.DONTDISPLAYALERTS;

var workFolder = new Folder ('D:\\work'); //Ссылка на рабочий каталог
var blank = new File (workFolder + '\\blank.ai'); //Ссылка на файл blank.ai
var etc = new File (workFolder + '\\PHP_OOO\\02_2014\\69x185\\Abrico_Med_cvetochny_500g.eps'); //Ссылка на файл этикетки


							// Считываем данные из файла
db_name = 'db_emulation';
tempFolder = new Folder('D:\\work\\temp');
tempFile = new File(tempFolder + '\\' + db_name + '.txt');
tempFile.open('r');
data = tempFile.read();
dataInput = eval(data);
tempFile.close;

app.open (etc);	// Открываем макет (файл этикетки)
var myDoc = app.activeDocument; //Создаем ссылку на активный документ

newlayer = myDoc.layers.add(); // Создаем слой для бланка
newlayer.name = 'blank'; // называем его именем blank
newlayer.zOrder(ZOrderMethod.BRINGTOFRONT); // и помещаем его в самый верх в пачке слоев документа
var bLayer = myDoc.layers['blank']; // Ссылка на слой blank
var cutLayer = myDoc.layers['cut']; // Ссылка на слой cut

							// Определяем размещение бланка
	// Находим центр этикетки по контуру высечки

cut_path = cutLayer.pathItems[0]; // Ссылка на контур высечки
cut_xPos = cut_path.position[0] + cut_path.width/2;
cut_yPos = cut_path.position[1] - cut_path.height/2;

							// Загружаем шаблон бланка

blank_template = myDoc.placedItems.add();
bt = blank_template;
bt.file = File(blank);

blank_xPos = cut_xPos - (bt.width/2);
blank_yPos = cut_yPos + (bt.height/3);

bt.position = new Array (blank_xPos, blank_yPos);


		// Определяем центр шаблона бланка

blank_template.embed(); // Внедряем бланк

var a_group = bLayer.groupItems[0].groupItems[0].groupItems[0];
var a_items = a_group.pageItems;


							// Заполняем бланк

	// Текущая дата
current_date = a_items[0];
d = new Date();
date = d.getDate() + '.0' + (d.getMonth()+1) + '.' + d.getFullYear();
current_date.contents = date;

	// Уточняем размеры X и Y

var cutRate = cut_path.width/cut_path.height;
var labelRate = dataInput['sizeX']/dataInput['sizeY'];

if (cutRate == labelRate) {
	
	// Размеры этикетки по Х
sizeX_label = a_items[1];
sizeX_label.contents = dataInput['sizeX'];

	// Размеры этикетки по Y
sizeY_label = a_items[2];
sizeY_label.contents = dataInput['sizeY'];

} else {
	
	// Размеры этикетки по Х
sizeX_label = a_items[2];
sizeX_label.contents = dataInput['sizeX'];

	// Размеры этикетки по Y
sizeY_label = a_items[1];
sizeY_label.contents = dataInput['sizeY'];	
		
	}
/*
	// Диаметр этикетки (только для круглых)
diam_label = a_items[3];
diam_label.contents = dataInput['diam'];

	// Дизайнер
designer_name= a_items[4];
designer_name.contents = dataInput['designer'];

	// Менеджер
manager_name= a_items[5];
manager_name.contents = dataInput['manager'];

	// Наименование
order_name= a_items[6];
order_name.contents = dataInput['name'];

	// Заказчик
customer_name = a_items[7];
customer_name.contents = dataInput['customer'];

	// № паспорта
task_number = a_items[8];
task_number.contents = 'd' + dataInput['task'];

	// № заказа
order_number = a_items[9];
order_number.contents = dataInput['order'];

	// Лак выборочный
if (dataInput['lak_select'] > 0) {
	lak_select = 'x';
	} else {
		lak_select = ' ';
	}
lak_selected = a_items[10];
lak_selected.contents = lak_select;

	// Лак сплошной
if (dataInput['lak_solid'] > 0) {
	lak_solid = 'x';
	} else {
		lak_solid = ' ';
	}
lak_solided = a_items[11];
lak_solided.contents = lak_solid;

	// Клей
if (dataInput['klei'] > 0) {
	klei = 'x';
	} else {
		klei = ' ';
	}
klei_param = a_items[12];
klei_param.contents = klei;

	// Тиснение горячее
if (dataInput['tis_hot'] > 0) {
	tis_hot = 'x';
	} else {
		tis_hot = ' ';
	}
tis_hot_param = a_items[13];
tis_hot_param.contents = tis_hot;

	// Тиснение
if (dataInput['tis'] > 0) {
	tis = 'x';
	} else {
		tis = ' ';
	}
tis_param = a_items[14];
tis_param.contents = tis;

	// Конгрев
if (dataInput['kongrev'] > 0) {
	kongrev = 'x';
	} else {
		kongrev = ' ';
	}
kongrev_param = a_items[15];
kongrev_param.contents = kongrev;

	// Opaque
if (dataInput['ink_0'] > 0) {
	opaque = 'x';
	} else {
		opaque = ' ';
	}
opaque_ink = a_items[16];
opaque_ink.contents = opaque;

	// Cyan
if (dataInput['ink_1'] > 0) {
	cyan = 'x';
	} else {
		cyan = ' ';
	}
cyan_ink = a_items[17];
cyan_ink.contents = cyan;

	// Magenta
if (dataInput['ink_2'] > 0) {
	magenta = 'x';
	} else {
		magenta = ' ';
	}
magenta_ink = a_items[18];
magenta_ink.contents = magenta;

	// Yellow
if (dataInput['ink_3'] > 0) {
	yellow = 'x';
	} else {
		yellow = ' ';
	}
yellow_ink = a_items[19];
yellow_ink.contents = yellow;

	// Black
if (dataInput['ink_4'] > 0) {
	black = 'x';
	} else {
		black = ' ';
	}
black_ink = a_items[20];
black_ink.contents = black;

	// Orange
if (dataInput['ink_5'] > 0) {
	orange = 'x';
	} else {
		orange = ' ';
	}
orange_ink = a_items[21];
orange_ink.contents = orange;

	// Violet
if (dataInput['ink_6'] > 0) {
	violet = 'x';
	} else {
		violet = ' ';
	}
violet_ink = a_items[22];
violet_ink.contents = violet;

							// Экспорт в jpg

exportOptions  = new ExportOptionsJPEG();
type = ExportType.JPEG;
fileSpec = new File (workFolder +  '\\PHP_OOO\\02_2014\\69x185\\Abrico_Med_cvetochny_500g');
exportOptions.antiAliasing = true;
exportOptions.qualitySetting = 70;
exportOptions.horizontalScale = 400;
exportOptions.verticalScale = 400;


myDoc.exportFile (fileSpec, type, exportOptions);

							// Закрываем документ без сохранения

myDoc.close (SaveOptions.DONOTSAVECHANGES);
*/