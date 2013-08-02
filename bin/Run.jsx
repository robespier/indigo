#target Illustrator-13

$.writeln('Run Here');
#include "/w/bin/mc.jsx"

// Обычная сборка

#include "/w/bin/Assembly.jsx"
make = new assembly(app);
make.setup();
make.run();


// Сборка-утверждение

#include "/w/bin/Matching.jsx"
collect = new matching(app);
collect.setup();
collect.run();


// Ахтунг

#include "/w/bin/Achtung.jsx"
attention = new achtung(app);
attention.setup();
attention.run(); 

