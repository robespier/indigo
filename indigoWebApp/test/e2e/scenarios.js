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
});
