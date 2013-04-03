var DocRef = app.activeDocument;

function Cl() {
var CropLength = 15;
var CropTop = 0;
var CropLeft = 0;
var CropRight = 200;
var CropDown = 200;

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



var plate = DocRef.layers['Mark'].pathItems.rectangle (-10, 10, 20, 40);
plate.stroked = false;