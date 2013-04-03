var amat = app.getTranslationMatrix (30, 30);
var arec = app.activeDocument.pageItems['are'];
arec.translate (amat);
$.writeln (amat);