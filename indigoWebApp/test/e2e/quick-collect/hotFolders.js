var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
var expect = chai.expect;

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

	it('should be CMYKOV_White', function() {
		V.click();
		expect(hotFolder.getText()).to.eventually.equal('CMYKOV_White');
	});

	it('should be back to CMYK', function() {
		Op.click();
		Op.click();
		expect(hotFolder.getText()).to.eventually.equal('CMYK');
	});
});
