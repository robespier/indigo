#include ../include/indigo.jsxinc

// Тут, ясное дело, надо прописать реальный путь к webaccesslib.dll 
var webaccesslib = new ExternalObject('lib:' + Indigo.config.webaccesslib);

var c = new Indigo.Controller();
// АЛГА!!!
c.run();
c.cleanup();

// Мой коммент!