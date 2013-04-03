// Проверка всех файлов типа аи на слои

var rootcuts = Folder('E:\TEMP\\cuts\\8\\');
var log = File ('E:\TEMP\\cuts\\enum.log');

function DoSome (ai) {
	app.open (ai);
	var DocRef = app.activeDocument;
	var DocName = DocRef.name;
	log.write(DocName,'\t');
	// Сортировка имен слоев по алфавиту 
		larr = DocRef.layers;
		larrout = new Array ();
	for (l=0; l < larr.length; l++) {
		larrout.push(larr[l].name);
		};
	larrout.sort ();
	for (l=0; l < larrout.length; l++) {
		log.write('"',larrout[l],'"','\t');
		};
	log.writeln();
	DocRef.close();
	};

function GetTree (fld) {
	var desc = fld.getFiles ('*.*');
		for (i in desc) {
			if ( desc[i].reflect.name == 'Folder' ) {
				GetTree( desc[i] );
			}
			else {
				//$.writeln (desc[i].fullName);
				DoSome (desc[i]);
			};			
		};
};

app.userInteractionLevel.DONTDISPLAYALERTS;

log.open ('w');
GetTree(rootcuts);
log.close();