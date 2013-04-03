#target illustrator-15

var workroot='E:\\WORKS\\JS-cuts\\';
// Извлечение номера высечки откуда-нибудь в String
//var stampnum='1100271';
var stampnum='4152640';
// Извлечение данных откуда-нибудь в XML
var src = File (workroot.concat (stampnum, '.xml'));
src.open('r');
var data = src.readln();
src.close();
var datasource = new XML (data);

// Функция перевода из миллиметров в пункты
// Иллюстратор работает только в пунктах.
// 2.83464566929134 пунктов = 1 миллиметр
function mmtp (mm) {
return mm*2.83464566929134
};

// Немного упростим себе жизнь
var ListHeight = mmtp (parseFloat (datasource.stamp.K));
var ListWidth = mmtp (parseFloat (datasource.stamp.W));
var ItemHeight = mmtp (parseFloat (datasource.stamp.B));
var ItemWidth = mmtp (parseFloat (datasource.stamp.L));
var AQ = mmtp (parseFloat (datasource.stamp.AQ));
var AL = mmtp (parseFloat (datasource.stamp.AL));
var CountX = parseInt (datasource.stamp.X);
var CountY = parseInt (datasource.stamp.Y);

	// Импорт высечки ?
var src = File (workroot.concat (stampnum,'.ai'));
app.open (src);
app.activeDocument.pathItems[0].move (DocRef.layers['Cut'], ElementPlacement.PLACEATEND);
app.activeDocument.close(SaveOptions.DONOTSAVECHANGES);

// Создание документа
var dp = new DocumentPreset;
dp.colorMode = DocumentColorSpace.CMYK;
dp.height = mmtp (parseFloat (datasource.stamp.K));
dp.width=mmtp (parseFloat (datasource.stamp.W));
dp.units=RulerUnits.Millimeters;

var DocRef = app.documents.addDocument (app.startupPresetsList[0], dp);
DocRef.rulerOrigin = Point (0, dp.height);

var StartY = -(ListHeight - (ItemHeight*CountY) - (AL*(CountY-1)))/2;
var StartX = (ListWidth - (ItemWidth*CountX) - (AQ*(CountX-1)))/2;

function Place(x,y) {
		this.xord = x;
		this.yord = y;
};

// Матрица координат высечек
var mtxCut = new Array ();
for ( y = 0; y <= CountY-1; y++ ) {
	for ( x = 0; x <= CountX-1; x++ ) {
		mtxCut.push(new Place((StartX+(ItemWidth+AQ)*x), (StartY-(ItemHeight+AL)*y)));
	}
}
// Матрица координат этикеток
var mtxItem = new Array();
var ItemOffset = mmtp (1); // 1 миллиметр навылет
for (Itr = 0; Itr <= mtxCut.length-1; Itr++) {
	mtxItem.push(new Place(mtxCut[Itr].xord-ItemOffset,mtxCut[Itr].yord+ItemOffset));
};

// Создание слоя высечки
function makeCuts() {
	DocRef.layers[0].name = 'Cut';
	DocRef.layers[0].printable = false;	
	// Импорт высечки
	// var src = File (workroot.concat (stampnum,'.ai'));
	// app.open (src);
	// app.activeDocument.pathItems[0].move (DocRef.layers['Cut'], ElementPlacement.PLACEATEND);
	// app.activeDocument.close(SaveOptions.DONOTSAVECHANGES);
	// Размещение высечки на листе
	for ( Itr = 0; Itr <= mtxCut.length-1; Itr++) {
		DocRef.layers['Cut'].pathItems[Itr].position = Point(mtxCut[Itr].xord, mtxCut[Itr].yord);
		DocRef.layers['Cut'].pathItems[Itr].duplicate();
	};
	DocRef.layers['Cut'].pathItems[mtxCut.length].remove();
};
// Создание слоя меток
function makeMarks() {
	DocRef.layers.add();
	DocRef.layers[0].name='Mark';

	var PlateWidth = mmtp (6);
	var PlateHeight = mmtp (8);	
	var PlateGap = mmtp (2);
	
	var MaxWidth = mmtp(308);
	
	var CropLength = mmtp(5);
	var CropTop = mmtp(0);
	var CropLeft = mtxCut[0].xord - PlateGap - PlateWidth;
	if ( ListWidth - (CropLeft*2) > MaxWidth ) {
		PlateWidth -= ( ListWidth - (CropLeft*2) - MaxWidth ) /2;
		if (PlateWidth < mmtp(4)) {
			alert ('Ширина контрольной метки меньше 4 мм');
		};
		CropLeft = mtxCut[0].xord - PlateGap - PlateWidth;
	};
	var CropRight = ListWidth-CropLeft;
	var CropDown = ListHeight;

	// Black plates
	var PlateX = CropLeft;
	var PlateY = mtxCut[0].yord - ItemHeight + PlateHeight;
		
	for ( Itr = 0; Itr < CountY; Itr++ ) {
		var Plate = DocRef.layers['Mark'].pathItems.rectangle (PlateY-(ItemHeight+AL)*Itr, PlateX, PlateWidth, PlateHeight);
		Plate.stroked = false;
		var BlackFill = new CMYKColor();
		BlackFill.black = 100;
		Plate.fillColor = BlackFill;
	}
	
	// Left Top Click
	var pp = new Array();
	pp[0] = new Array(CropLeft, CropTop-CropLength);
	pp[1] = new Array(CropLeft, CropTop);
	pp[2] = new Array(CropLeft+CropLength, CropTop);
	var Click = DocRef.layers['Mark'].pathItems.add();
	Click.setEntirePath (pp);
	Click.filled = false;
	Err = Click.strokeWidth /2;
	Click.position = Point(Click.position[0]+Err, Click.position[1]-Err);
	Click.name='Click_Left';

	// Right Top click
	var pp = new Array();
	pp[0] = new Array(CropRight-CropLength, CropTop);
	pp[1] = new Array(CropRight, CropTop);
	pp[2] = new Array(CropRight, CropTop-CropLength);
	var Click = DocRef.layers['Mark'].pathItems.add();
	Click.setEntirePath (pp);
	Click.filled = false;
	Err = Click.strokeWidth /2;
	Click.position = Point(Click.position[0]-Err, Click.position[1]-Err);
	Click.name='Click_Right_Top';

	//Right Bottom Click
	var pp = new Array();
	pp[0] = new Array(CropRight-CropLength, -CropDown);
	pp[1] = new Array(CropRight, -CropDown);
	pp[2] = new Array(CropRight, -CropDown+CropLength);
	var Click = DocRef.layers['Mark'].pathItems.add();
	Click.setEntirePath (pp);
	Click.filled = false;
	Err = Click.strokeWidth /2;
	Click.position = Point(Click.position[0]-Err, Click.position[1]+Err);
	Click.name='Click_Right_Bottom';
};

// Создание слоя этикетки
function makeLabels() {
	DocRef.layers.add();
	DocRef.layers[0].name='Labels';
	DocRef.layers['Labels'].zOrder(ZOrderMethod.SENDTOBACK);
	DocRef.layers['Labels'].placedItems.add();
	DocRef.layers['Labels'].placedItems[0].file = File (workroot.concat ('doctors.eps'));
// Размещение этикетки на листе
	for ( Itr = 0; Itr <= mtxItem.length-1; Itr++) {
		DocRef.layers['Labels'].placedItems[Itr].position = Point(mtxItem[Itr].xord, mtxItem[Itr].yord);
		DocRef.layers['Labels'].placedItems[Itr].duplicate();
	};
	DocRef.layers['Labels'].placedItems[mtxItem.length].remove();
};



makeCuts ();
makeMarks ();
makeLabels ();

var DocFile = new File (workroot.concat (stampnum,'-auto','.ai'));
DocRef.saveAs(DocFile);