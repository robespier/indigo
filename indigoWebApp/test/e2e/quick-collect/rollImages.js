var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
var expect = chai.expect;

describe('display roll image', function() {
	var head_mashine, foot_mashine, foot_forward, head_forward,
		roll_image;

	beforeEach(function() {
		browser.get('/#/jobs');
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
