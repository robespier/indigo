#target Illustrator-13

#include "mc.jsx"

/*
 * Обычная сборка
 */
#include "Assembly.jsx"
make = new assembly(app);

make.setup();
make.roll_number = 2;
make.task = '5006006'; //Определяем переменные для паспорта 
make.temp = 4090354;
make.run();

/*
 * Сборка-утверждение
 */
#include "Matching.jsx"
u = new matching(app);
u.setup();
u.roll_number = 2;
u.templateFolder = new Folder ('D:\\work\\template\\short');
u.temp = '4090354_short';
u.run();

/*
 * Ахтунг
 */
/*
a = new achtung(app);
a.setup();
a.run(); 
*/
