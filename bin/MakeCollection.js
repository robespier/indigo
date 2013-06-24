//Make Collection
//Скрипт производит верстку файлов под Indigo WS 6000 на основе шаблона сборки.

#target illustrator-13

//////////////////////////////////////////////////////////////////////////////////////////
//
//
//
//
//Делаем сборку-внимание
//
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



var jobcontainer = new Folder ('Z:\\'); //Папка рабочего каталога
var achtung = new File ('Z:\\ACHTUNG.eps'); //Ссылка на файл ACHTUNG.eps

var achtungPlace = newlayer.placedItems.add();
achtungPlace.file = achtung; //Помещаем на слой layer файл ACHTUNG.eps

var targetPlace = new Array ((myDoc.width/2)-(achtungPlace.width/2), (myDoc.height/2)+(achtungPlace.height/2));

//Помещаем ахтунг в центр арбоарда
achtungPlace.position = targetPlace; //Выравниваем этикетку по целевому контуру

//Корректируем размеры ахтунга

var width_percent = (myDoc.width*88)/achtungPlace.width;
var height_percent = (myDoc.height*99)/achtungPlace.height;

achtungPlace.resize (width_percent, height_percent);


//Закрываем активный документ
myDoc.close (SaveOptions.DONOTSAVECHANGES);
