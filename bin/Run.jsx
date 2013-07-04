#target Illustrator-13

#include "mc.jsx"

// Обычная сборка

#include "Assembly.jsx"
make = new assembly(app);

make.setup();
make.run();


// Сборка-утверждение

#include "Matching.jsx"
collect = new matching(app);
//TODO перенести переопределение templateFolder и temp в матчинг
collect.setup();
collect.templateFolder = new Folder ('D:\\work\\template\\short');
collect.temp = '4090354_short';
collect.run();

/*
// Ахтунг

#include "Achtung.jsx"
a = new achtung(app);
a.setup();
a.templateFolder = new Folder ('D:\\work\\template\\short');
a.temp = '4090354_short';
a.run(); 
*/