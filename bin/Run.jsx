#include ../include/indigo.jsxinc

var webaccesslib;
// Будет использован первый найденный webaccesslib из конфига indigo
for (var path_index in Indigo.config.webaccesslib) {
	var lib_file = new File(Indigo.config.webaccesslib[path_index]);
	if (lib_file.exists) {
		webaccesslib = new ExternalObject('lib:' + lib_file.fullName);
		break;
	}
}

var c = new Indigo.Controller();
// АЛГА!!!
c.run();
c.cleanup();
