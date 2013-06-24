#target Illustrator-13

#include "mc.jsx"
#include "Assembly.jsx"

/*
 * Обычная сборка
 */

make = new assembly(app);

make.setup();
make.roll_number = 0;
make.task = '5006006'; //Определяем переменные для паспорта 
make.temp = 4090354;
make.run();

/*
 * Сборка-утверждение
 */
/*
utv = new matching(app);
u.setup();
u.run();

/*
 * Ахтунг
 */
/*
a = new achtung(app);
a.setup();
a.run(); 
*/
