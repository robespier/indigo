#target illustrator-15
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Глобальные переменные
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
var workroot='E:\\TEMP\\cuts\\';

var ItemOffset = mmtp (1); // 1 миллиметр этикетки навылет
var markPlateWidth = mmtp(6); // Ширина плашки DigIcon
var markPlateWidthMin = mmtp(3.5); // Минимальная ширина плашки DigIcon
var markPlateHeight = mmtp(8); // Высота плашки DigIcon
var markClickSize = mmtp(5); // Ширина и высота метки клика
var markOffset  = mmtp(2); // Расстояние от контура до плашек DigIcon

var strLablelFile = app.activeDocument.fullName;
var strLabelFileName = app.activeDocument.name;
var PureFileName = strLabelFileName.substr(0, strLabelFileName.lastIndexOf("."));
var strLabelFolder = app.activeDocument.path.toString();
var PDFSettings = new PDFSaveOptions();
	PDFSettings.acrobatLayers = false;

var strRolloverLayerName = "Rollover";
var strStampLayerName = "Cuts";
var strMarksLayerName = "Marks";
var strStikersLayerName = "Labels";

var strReturnSuccess = "Ошибок не обнаружилось";
var strReturnFailure = "Жопа";

var strErrorTitle = "Хуй в крынку не лезет";
var strErrorMessages = new Array();
	strErrorMessages.push("Откройте файл с этикеткой");
	strErrorMessages.push("Требуется целочисленное значение");
	strErrorMessages.push("Отсутствует файл высечки");
	strErrorMessages.push("Отсутствует информация о намотке");
	strErrorMessages.push("Информация о намотке неоднозначна");
	strErrorMessages.push("Отсутствует слой высечки");
	strErrorMessages.push("Информация о высечке неоднозначна");
	strErrorMessages.push("Непорядок с высотой верстки");
	strErrorMessages.push("Перебор по ширине верстки");
	strErrorMessages.push("Ширина контрольной метки меньше ".concat(ptmm(markPlateWidth), " мм"));
	
var Machines = new Array();
	Machines.push(new PressProperties ("HP INDIGO ws 4500", mmtp(0), mmtp(450), mmtp(308)));
	Machines.push(new PressProperties ("HP INDIGO ws 6000", mmtp(470), mmtp(980), mmtp(317))); // TODO: 317 проверить


////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Точка входа
////////////////////////////////////////////////////////////////////////////////////////////////////////////////


main();


////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
//	Объекты
//
////////////////////////////////////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Свойства печатной машины
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function PressProperties (mName, lMin, lMax, wMax) {
	this.PressName = mName; // Название машины
	this.LMin = lMin; // Минимальная длина клика
	this.LMax = lMax; // Максимальная длина клика
	this.WMax = wMax; // Максимальная ширина клика
	};
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Точка (зачем?..)
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function Place(x,y) {
		this.xord = x;
		this.yord = y;
};
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
//	Функции
//
////////////////////////////////////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Перевод из миллиметров в пункты
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function mmtp (mm) {
// Иллюстратор работает только в пунктах.
// 2.83464566929134 пунктов = 1 миллиметр
return mm*2.83464566929134
};
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Перевод из пунктов в миллиметры
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function ptmm (pt) {
return pt*0.35277777777777760138888888888898
};
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Диалог ввода параметров
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function RequestParams (collector) {

	function padZeros(num) {
		tmp = "000" + num;
		return tmp.substr (tmp.length-3, tmp.length)
		};

	var Forms = new Array("1 - Прямоугольная", "2 - Круглая", "3 - Овальная", "4 - Фигурная", "5 - Защитная", "6 - Комплект", "7 - Перфорация", "8 - Прочие");
	var Zets = new Array("064", "075", "084", "090", "096", "100", "108", "115", "117", "120", "128", "133", "140", "152");

	var strScriptTitle="Auto-Layout v 1.02 Параметры";
	var strPress = "Машина:";
	var strStampTitle = "Высечка";
	var strstampForm = "Форма:";
	var strstampZ = "Z:";
	var strstampNum = "Номер:";

	var dlgSelector = new Window("dialog", strScriptTitle);
	dlgSelector.orientation = 'column';
	dlgSelector.alignChildren = 'left';
	dlgSelector.alignment = 'fill';

	// Выбор печатной машины
	dlgSelector.grpPress = dlgSelector.add("panel");
	dlgSelector.grpPress.orientation = 'row';
	dlgSelector.grpPress.alignment = 'fill';

	dlgSelector.grpPress.add("statictext", undefined, strPress);
	dlgSelector.ddpressType = dlgSelector.grpPress.add("dropdownlist");
	for ( i = 0; i < Machines.length; i++) {
		dlgSelector.ddpressType.add("item", Machines[i].PressName);
		};
	dlgSelector.ddpressType.selection = 0;

	dlgSelector.grpPress.add("statictext", undefined, "Этикеток по X:");
	dlgSelector.txtX = dlgSelector.grpPress.add("edittext");
	dlgSelector.txtX.characters = 3;
	dlgSelector.txtX.text = collector.defaultX;
	dlgSelector.txtX.onChange = function () {
		num = parseInt (this.text);
		if ( isNaN(num) ) {
			this.text = collector.defaultX.toString();
			alert (strErrorMessages[1], strErrorTitle, true);
			};
			else {
			collector.defaultX = num;
			};
		this.text = collector.defaultX;
		};

	dlgSelector.grpPress.add("statictext", undefined, "по Y:");
	dlgSelector.txtY = dlgSelector.grpPress.add("edittext");
	dlgSelector.txtY.characters = 3;
	dlgSelector.txtY.text = collector.defaultY;
	dlgSelector.txtY.onChange = function () {
		num = parseInt (this.text);
		if ( isNaN(num) ) {
			this.text = collector.defaultY.toString();
			alert (strErrorMessages[1], strErrorTitle, true);
			};
			else {
			collector.defaultY = num;
			};
		this.text = collector.defaultY;
		};

	// Выбор штампа
	dlgSelector.grpStamp = dlgSelector.add("panel");
	dlgSelector.grpStamp.text = strStampTitle;
	dlgSelector.grpStamp.orientation = 'row';
	dlgSelector.grpStamp.alignment = 'fill';
	dlgSelector.grpStamp.add("statictext", undefined, strstampForm);
	dlgSelector.ddStampType = dlgSelector.grpStamp.add("dropdownlist");
	for ( i = 0; i < Forms.length; i++ ) {
		dlgSelector.ddStampType.add("item", Forms[i]);
		};
	dlgSelector.ddStampType.selection = 3;

	dlgSelector.grpStamp.add("statictext", undefined, strstampZ);
	dlgSelector.ddstampZ = dlgSelector.grpStamp.add("dropdownlist");
	for ( i = 0; i < Zets.length; i++ ) {
		dlgSelector.ddstampZ.add("item", Zets[i]);
		};
	dlgSelector.ddstampZ.selection = 13;

	dlgSelector.grpStamp.add("statictext", undefined, strstampNum);
	dlgSelector.txtstampNum = dlgSelector.grpStamp.add("edittext");
	dlgSelector.txtstampNum.characters = 4;
	dlgSelector.txtstampNum.text = collector.defaultstampNum;
	dlgSelector.txtstampNum.onChange = function () {
		num = parseInt (this.text);
		if ( isNaN(num) ) {
			this.text = collector.defaultstampNum.toString();
			alert (strErrorMessages[1], strErrorTitle, true);
			};
			else {
			collector.defaultstampNum = num;
			};
		this.text = collector.defaultstampNum;
		};

	dlgSelector.gprControl = dlgSelector.add("group");
	dlgSelector.btnStart = dlgSelector.gprControl.add("button");
	dlgSelector.btnStart.text = "Алга!";
	dlgSelector.btnStart.onClick = function() {
		collector.pressType = dlgSelector.ddpressType.selection.index;
		collector.itemsByX = parseInt(dlgSelector.txtX.text);
		collector.itemsByY = parseInt(dlgSelector.txtY.text);
		collector.stampForm = (dlgSelector.ddStampType.selection.index + 1).toString();
		collector.stampZ = dlgSelector.ddstampZ.selection.toString();
		collector.stampNum = padZeros(dlgSelector.txtstampNum.text);
		dlgSelector.close (result);
		};
	var result = dlgSelector.show();
	};
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Проверка введенных данных
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function ValidateUserValues(collector) {
	//
	// Файл высечки существует?
	//
	var stampfilename = workroot.concat(collector.stampForm, "\\z", collector.stampZ, "\\", collector.stampForm, collector.stampZ, collector.stampNum, ".ai");
	var stampfile = new File(stampfilename);
	if ( stampfile.exists == false ) {
		alert (strErrorMessages[2], strErrorTitle, true);
		return strReturnFailure;
		};
	collector.stampFileName = stampfilename;
	app.open(stampfile);
	stampDocRef = app.activeDocument;
	//
	// Что по намотке?
	//
	try {
		var RolloverID = parseInt(stampDocRef.layers[strRolloverLayerName].textFrames[0].contents);
		if ( (stampDocRef.layers[strRolloverLayerName].textFrames.length > 1) || (isNaN(RolloverID)) || (RolloverID < 0 )  || (RolloverID > 8 ) ) {
			alert (strErrorMessages[4], strErrorTitle, true);
			return strReturnFailure;
			};
			else {
				collector.itemRolloverID = RolloverID;
			};
		}
	catch (e) {
		alert (strErrorMessages[3], strErrorTitle, true);
		return strReturnFailure;
		};
	//
	// Проверка контура высечки
	//
	try {
		var StampLayer = stampDocRef.layers.getByName (strStampLayerName);
		if ( StampLayer.pathItems.length > 1 ) {
			alert (strErrorMessages[6], strErrorTitle, true);
			return strReturnFailure;
			};
		}
	catch (e) {
		alert (strErrorMessages[5], strErrorTitle, true);
		return strReturnFailure;
		};
	//
	// 
	//
	var StampItself = StampLayer.pathItems[0];
	collector.itemHeight = StampItself.height;
	collector.itemWidth = StampItself.width;
	collector.stampAQ = StampItself.position[0]*2;
	collector.stampAL = -StampItself.position[1]*2;
	
	//
	// Проверка по высоте
	//
	var overallHeight = (collector.itemHeight*collector.itemsByY) + (collector.stampAL*(collector.itemsByY - 1)) + (markOffset*2);
	if ( (overallHeight < Machines[collector.pressType].LMin)||(overallHeight > Machines[collector.pressType].LMax ) ) {
			alert (strErrorMessages[7].concat('\nТекущая высота: ', ptmm(overallHeight), ' мм\nМаксимальная высота: ',  ptmm(Machines[collector.pressType].LMax), ' мм'), strErrorTitle, true);
			return strReturnFailure;
		};
		else {
			collector.overallHeight = overallHeight;
			};
	//
	// Проверка по ширине
	//
	var overallWidth = (collector.itemWidth*collector.itemsByX) + (collector.stampAQ*(collector.itemsByX - 1)) + (markOffset*2) + markPlateWidth;
	if ( overallWidth > Machines[collector.pressType].WMax ) {
		// Попытаемся ужать плашку DigIcon
		var deltaPlateWidth = overallWidth - Machines[collector.pressType].WMax;
		if ( (markPlateWidth - deltaPlateWidth) > markPlateWidthMin) {
			(strErrorMessages[9], strErrorTitle, true);
			markPlateWidth = markPlateWidth - deltaPlateWidth;
			overallWidth = overallWidth - deltaPlateWidth;
			};
		else {
			// Не удалось ужать плашку DigIcon
			alert (strErrorMessages[8].concat('\nТекущая ширина:', ptmm(overallWidth), ' мм\nМаксимальная ширина: ', ptmm(Machines[collector.pressType].WMax), ' мм'), strErrorTitle, true);
			return strReturnFailure;
			};
		};
		collector.overallWidth = overallWidth;
		stampDocRef.close(SaveOptions.DONOTSAVECHANGES);
		return strReturnSuccess;
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Расчет геометрии
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function CalculateGeometrics(collector) {

	var StartX = markPlateWidth + markOffset;
	var StartY = -markOffset;
	//
	// Матрица координат высечек
	//
	collector.mtxCut = new Array ();
	for ( y = 0; y <= collector.itemsByY-1; y++ ) {
		for ( x = 0; x <= collector.itemsByX-1; x++ ) {
			collector.mtxCut.push(new Place((StartX+(collector.itemWidth+collector.stampAQ)*x), (StartY-(collector.itemHeight+collector.stampAL)*y)));
			};
		};
	//
	// Матрица координат этикеток
	//
	collector.mtxItem = new Array();
	for (Itr = 0; Itr <= collector.mtxCut.length-1; Itr++) {
		collector.mtxItem.push(new Place(collector.mtxCut[Itr].xord-ItemOffset, collector.mtxCut[Itr].yord+ItemOffset));
		};

};
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Создание документа
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function PrepareDoc(collector) {	
	//
	// Создание документа, где будет лежать верстка
	//	
	var dp = new DocumentPreset;
	dp.colorMode = DocumentColorSpace.CMYK;
	dp.height = collector.overallHeight;
	dp.width=collector.overallWidth;
	dp.units=RulerUnits.Millimeters;

	var layoutDocRef = app.documents.addDocument (app.startupPresetsList[0], dp);
	layoutDocRef.rulerOrigin = Point (0, dp.height);
	collector.layoutDoc = layoutDocRef;
	return strReturnSuccess;
	};
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Создание слоя этикетки
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function MakeLabels(collector) {
	layoutDocRef = collector.layoutDoc
	layoutDocRef.layers[0].name=strStikersLayerName;
	var Label = layoutDocRef.layers[strStikersLayerName].placedItems.add();
	Label.file = File (strLablelFile);
	// Крутим по намотке
	var RolloverAngle = 0;
	switch (collector.itemRolloverID) {
		case 1: RolloverAngle = 90; break;
		case 2: RolloverAngle = -90; break;
		case 3: RolloverAngle = 180; break;
		case 4: RolloverAngle = 0; break;
		case 5: RolloverAngle = -90; break;
		case 6: RolloverAngle = 90; break;
		case 7: RolloverAngle = 180; break;
		case 8: RolloverAngle = 0; break;
		};
	Label.rotate(RolloverAngle);
	Label.position = Point(collector.mtxItem[0].xord, collector.mtxItem[0].yord);
	// Размещение этикетки на листе
	for ( Itr = 1; Itr <= collector.mtxItem.length-1; Itr++) {
		layoutDocRef.layers[strStikersLayerName].placedItems[Itr-1].duplicate();
		layoutDocRef.layers[strStikersLayerName].placedItems[Itr].position = Point(collector.mtxItem[Itr].xord, collector.mtxItem[Itr].yord);
	};
};
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Создание слоя меток
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function MakeMarks(collector) {
	DocRef = collector.layoutDoc;
	DocRef.layers.add();
	DocRef.layers[0].name=strMarksLayerName;

	var CropTop = mmtp(0);
	var CropLeft = mmtp(0);
	var CropRight = collector.overallWidth;
	var CropDown = collector.overallHeight;

	// Black plates
	var PlateX = CropLeft;
	var PlateY = collector.mtxCut[0].yord - collector.itemHeight + markPlateHeight;
		
	for ( Itr = 0; Itr < collector.itemsByY; Itr++ ) {
		var Plate = DocRef.layers[strMarksLayerName].pathItems.rectangle (PlateY-(collector.itemHeight+collector.stampAL)*Itr, PlateX, markPlateWidth, markPlateHeight);
		Plate.stroked = false;
		var BlackFill = new CMYKColor();
		BlackFill.black = 100;
		Plate.fillColor = BlackFill;
	}
	
	// Left Top Click
	var pp = new Array();
	pp[0] = new Array(CropLeft, CropTop-markClickSize);
	pp[1] = new Array(CropLeft, CropTop);
	pp[2] = new Array(CropLeft+markClickSize, CropTop);
	var Click = DocRef.layers[strMarksLayerName].pathItems.add();
	Click.setEntirePath (pp);
	Click.filled = false;
	Err = Click.strokeWidth /2;
	Click.position = Point(Click.position[0]+Err, Click.position[1]-Err);
	Click.name='Click_Left';

	// Right Top click
	var pp = new Array();
	pp[0] = new Array(CropRight-markClickSize, CropTop);
	pp[1] = new Array(CropRight, CropTop);
	pp[2] = new Array(CropRight, CropTop-markClickSize);
	var Click = DocRef.layers[strMarksLayerName].pathItems.add();
	Click.setEntirePath (pp);
	Click.filled = false;
	Err = Click.strokeWidth /2;
	Click.position = Point(Click.position[0]-Err, Click.position[1]-Err);
	Click.name='Click_Right_Top';

	//Right Bottom Click
	var pp = new Array();
	pp[0] = new Array(CropRight-markClickSize, -CropDown);
	pp[1] = new Array(CropRight, -CropDown);
	pp[2] = new Array(CropRight, -CropDown+markClickSize);
	var Click = DocRef.layers[strMarksLayerName].pathItems.add();
	Click.setEntirePath (pp);
	Click.filled = false;
	Err = Click.strokeWidth /2;
	Click.position = Point(Click.position[0]-Err, Click.position[1]+Err);
	Click.name='Click_Right_Bottom';
};
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Создание слоя высечки
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function MakeCuts(collector) {
	DocRef = collector.layoutDoc;
	DocRef.layers.add();
	DocRef.layers[0].name = strStampLayerName;
	DocRef.layers[0].printable = false;
	// Импорт высечки
	var src = File (collector.stampFileName);
	app.open (src);
	app.activeDocument.pathItems[0].move (DocRef.layers[strStampLayerName], ElementPlacement.PLACEATEND);
	app.activeDocument.close(SaveOptions.DONOTSAVECHANGES);
	DocRef.layers[strStampLayerName].pathItems[0].position = Point(collector.mtxCut[0].xord, collector.mtxCut[0].yord);
	// Размещение высечки на листе
	for ( Itr = 1; Itr <= collector.mtxCut.length-1; Itr++) {
		DocRef.layers[strStampLayerName].pathItems[Itr-1].duplicate();
		DocRef.layers[strStampLayerName].pathItems[Itr].position = Point(collector.mtxCut[Itr].xord, collector.mtxCut[Itr].yord);
	};
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Главная
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function main() {
	if ( app.documents.length <=0 ) {
		alert (strErrorMessages[0], strErrorTitle, true);
		return strReturnFailure;
	};

//	app.activeDocument.close ();
	
	var parameters = new Object();
	parameters.defaultX = 4;
	parameters.defaultY = 3;
	parameters.defaultstampNum = 640;
	
	RequestParams (parameters);
	var retStatus = ValidateUserValues (parameters);
	if ( retStatus == strReturnSuccess ) {
		CalculateGeometrics(parameters);
		PrepareDoc(parameters);
		MakeLabels(parameters);
		MakeMarks(parameters);
		MakeCuts(parameters);
		};
	//layoutDocRef.layers[strStikersLayerName].zOrder(ZOrderMethod.SENDTOBACK);
	var ResultFileAI = new File (strLabelFolder.concat ("\\", PureFileName,"-auto.ai"));
	app.activeDocument.saveAs(ResultFileAI);
	var ResultFilePDF = new File (strLabelFolder.concat ("\\", PureFileName,"-auto.pdf"));
	app.activeDocument.saveAs(ResultFilePDF, PDFSettings);
	alert (retStatus, "Результат обработки");
};