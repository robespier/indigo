#target Illustrator-13

try {
	// If we are in Bridge call
	// Un-serialize job object from Bridge JSON-string
	var jobs = eval(job);
	$.writeln('Run from Bridge 3 Here');
	$.writeln(job);
} catch (e) {
	// Run.jsx runs independently
	// Eat mock, run.jsx!
	$.writeln('Run from ESTK 1 Here');
	var jobs = $.evalFile ('tests/jobsobj.jsn');
} 

#include "/w/bin/mc.jsx"
#include "/w/bin/Assembly.jsx"
#include "/w/bin/Matching.jsx"
#include "/w/bin/Achtung.jsx"

for (var ji=0, jl = jobs.length; ji < jl; ji++) {
	var j = jobs[ji];

	// Обычная сборка
	make = new assembly(app);
	make.setup(j);
	make.run();

	// Сборка-утверждение
	collect = new matching(app);
	collect.setup(j);
	collect.run();

	// Ахтунг
	attention = new achtung(app);
	attention.setup(j);
	attention.run();
	j.toSource();
}
