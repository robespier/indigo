// Make Collection
// Скрипт производит верстку файлов под Indigo WS 6000 на основе шаблона сборки.

#target illustrator-13

// Задаем переменные для паспорта. шаблона и намотки
var task = 5006006;
var tmp = 4090354;
var roll = 1;

//Рисуем окно диалога
var dlg = new Window('dialog', 'Make Collection',[600,450,1000,750]);
dlg.show();

alert ('В окне диалога Make Collection вводятся номер задания, \nномер шаблона высечки, а также выбирается тип намотки.');

//Открываем шаблон высечки

var tmpFolder = new Folder ('D:\\work\\template');
var template = new File (tmpFolder'\\'tmp'.ai');
app.open (template);

