Indigo.Tests.CoverageReporter = function() {};

Indigo.Tests.CoverageReporter.prototype = new Indigo.Tests.HtmlReporter();
Indigo.Tests.CoverageReporter.prototype.constructor = Indigo.Tests.CoverageReporter;

Indigo.Tests.CoverageReporter.prototype.log = function(entry) {
	var hitClass = entry.bclass ? 'class="'+entry.bclass+'"' : '';
	var logline = [];
	logline.push('<tr ' + hitClass + '>');
	logline.push('<td>' + entry.lineNumber + '</td>');
	logline.push('<td>' + entry.hit + '</td>');
	logline.push('<td style="border-top:none;white-space:pre">' + entry.code + '</td>');
	logline.push('</tr>');
	this.output += logline.join('');
};

Indigo.Tests.CoverageReporter.prototype._injectResults = function() {};
