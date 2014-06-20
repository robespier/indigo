var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
var expect = chai.expect;

describe('upload illustrator job', function() {
	var labels, sbm;

	beforeEach(function() {
		browser.get('index.html');
		labels = element(by.name('label_path'));
		sbm = element(by.id('submit'));
	});

	// incomplete //
	it('"cut_number" should be ok', function() {
		var cn = element(by.model('workset.cut_number'));
		cn.clear();
		cn.sendKeys('2128506');
	});

	// @todo Пепсиколов вводит всякую хрень вместо номера штампа //
	
	// @todo Пепсиколов ничего не вводит, сабмитит пустую форму //

	// Пепсиколов вводит список файлов в двойных кавычках //
	it('should be unquoted print-list', function() {
		labels.clear();
		labels.sendKeys('"test1.eps"');
		labels.sendKeys(protractor.Key.ENTER);
		labels.sendKeys('"test2.eps"');
		expect(labels.getAttribute('value')).to.eventually.equal('test1.eps\ntest2.eps');
	});

	// Пепсиколов сабмитит форму //
	it('should be submit', function() {
		var cutNumber = element(by.model('workset.cut_number')),
			roll = element(by.id('foot_mashine'));
		cutNumber.sendKeys('4090354');
		roll.click();
		labels.sendKeys("Y:\\d9\\111\\001\\spaklevka_08_klei.eps");
		labels.sendKeys(protractor.Key.ENTER);
		labels.sendKeys("Y:\\d9\\111\\002\\spaklevka_1_5_klei.eps");
		sbm.click();
	});
});

describe('select hotfolder', function() {
	var Op, C, M, Y, B, Or, V,
		hotFolder;

	beforeEach(function() {
		browser.get('index.html');
		Op = element(by.name('ink_0'));
		C  = element(by.name('ink_1'));
		M  = element(by.name('ink_2'));
		Y  = element(by.name('ink_3'));
		B  = element(by.name('ink_4'));
		Or = element(by.name('ink_5'));
		V  = element(by.name('ink_6'));
		hotFolder = element(by.tagName('h2'));
	});

	it('should be initial CMYK', function() {
		expect(hotFolder.getText()).to.eventually.equal('CMYK');
	});

	it('should be CMYKW', function() {
		Op.click();
		expect(hotFolder.getText()).to.eventually.equal('CMYKW');
	});

	it('should be CMYKOW_White', function() {
		V.click();
		expect(hotFolder.getText()).to.eventually.equal('CMYKOW_White');
	});

	it('should be back to CMYK', function() {
		Op.click();
		Op.click();
		expect(hotFolder.getText()).to.eventually.equal('CMYK');
	});
});

describe('display roll image', function() {
	var head_mashine, foot_mashine, foot_forward, head_forward,
		roll_image;

	beforeEach(function() {
		browser.get('index.html');
		head_mashine = element(by.id('head_mashine'));
		foot_mashine = element(by.id('foot_mashine'));
		foot_forward = element(by.id('foot_forward'));
		head_forward = element(by.id('head_forward'));
		roll_image   = element(by.id('roll_image'));
	});

	it('should be "head_mashine" image', function() {
		head_mashine.click();
		expect(roll_image.getAttribute('src')).to.eventually.string('images/roll_1_6.png');
	});

	it('should be "foot_mashine" image', function() {
		foot_mashine.click();
		expect(roll_image.getAttribute('src')).to.eventually.string('images/roll_2_5.png');
	});

	it('should be "foot_forward" image', function() {
		foot_forward.click();
		expect(roll_image.getAttribute('src')).to.eventually.string('images/roll_3_7.png');
	});

	it('should be "head_forward" image', function() {
		head_forward.click();
		expect(roll_image.getAttribute('src')).to.eventually.string('images/roll_4_8.png');
	});
});
