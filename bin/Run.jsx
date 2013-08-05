#target Illustrator-13

//$.writeln('Run Here');

// Un-serialize job object from Bridge JSON-string
j = eval(job);

#include "/w/bin/mc.jsx"

// Обычная сборка
#include "/w/bin/Assembly.jsx"
make = new assembly(app);
make.setup(j);
make.run();

// Сборка-утверждение
#include "/w/bin/Matching.jsx"
collect = new matching(app);
collect.setup(j);
collect.run();

// Ахтунг
#include "/w/bin/Achtung.jsx"
attention = new achtung(app);
attention.setup(j);
attention.run(); 

