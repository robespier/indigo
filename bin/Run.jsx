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
//TODO перенести переопределение templateFolder и temp в отдельную функцию
collect.setup();
collect.templateFolder = new Folder ('D:\\work\\template\\short');
collect.temp = '4090354_short';
collect.run();


// Ахтунг

#include "Achtung.jsx"
attention = new achtung(app);
//TODO перенести переопределение templateFolder и temp в отдельную функцию
attention.setup();
attention.templateFolder = new Folder ('D:\\work\\template\\short');
attention.temp = '4090354_short';
attention.run(); 
