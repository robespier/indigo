#target Illustrator-13

#include "lodash.js"
var aa_dups = [4,1,2,2,3,4,2,5];
var aa_uniqs = _.uniq(aa_dups);
if (aa_dups.length > aa_uniqs.length) {
	alert('array aa_dups contains repeated values');
}

#include "mc.jsx"
/*
// Обычная сборка

#include "Assembly.jsx"
make = new assembly(app);
make.setup();
make.run();

*/
// Сборка-утверждение

#include "Matching.jsx"
collect = new matching(app);
collect.setup();
collect.run();

/*
// Ахтунг

#include "Achtung.jsx"
attention = new achtung(app);
attention.setup();
attention.run(); 

/*
// Лак-форма

#include "Lacquer.jsx"
varnish = new lacquer(app);
varnish.setup();
varnish.run();

*/
