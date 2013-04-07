#target illustrator-13
//var n = new File('C:\\YandexDisk\\js\\indigo\\docs\\template\\1064002.ai');
var n = new File ('W:\\docs\\template\\1064002.ai');
var d = app.open (n);
// d.Layers.add(); -- был неправ, layers со строчной буквы должен быть
// Добавить новый слой в документ
d.layers.add();
// Добавить новый слой в документ и назвать его 'dup'
l = d.layers.add();
l.name = 'dup';
