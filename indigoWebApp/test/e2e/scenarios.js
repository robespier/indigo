var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
var expect = chai.expect;

describe('upload illustrator job', function() {

	beforeEach(function() {
		browser.get('index.html');
	});

	it('"cut_number" should be ok', function() {
		var cn = element(by.model('workset.cut_number'));
		cn.clear();
		cn.sendKeys('2128506');
	});

	// @todo Пепсиколов вводит всякую хрень вместо номера штампа //
	
	// @todo Пепсиколов ничего не вводит, сабмитит пустую форму //

	// Пепсиколов сабмитит форму //
	it('should be submit', function() {
		var cutNumber = element(by.model('workset.cut_number')),
			roll = element(by.id('foot_mashine')),
			labels = element(by.name('label_path')),
			sbm = element(by.id('submit'));
		cutNumber.sendKeys('4090354');
		roll.click();
		labels.sendKeys("Y:\\d9\\111\\001\\spaklevka_08_klei.eps");
		labels.sendKeys(protractor.Key.ENTER);
		labels.sendKeys("Y:\\d9\\111\\002\\spaklevka_1_5_klei.eps");
		sbm.click();
	});
});
