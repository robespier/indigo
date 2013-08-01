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
collect.setup();
collect.run();


// Ахтунг

#include "Achtung.jsx"
attention = new achtung(app);
attention.setup();
attention.run(); 

