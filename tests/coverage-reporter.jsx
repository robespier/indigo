Indigo.Tests.CoverageReporter = function() {};

Indigo.Tests.CoverageReporter.prototype = new Indigo.Tests.HtmlReporter();
Indigo.Tests.CoverageReporter.prototype.constructor = Indigo.Tests.CoverageReporter;

Indigo.Tests.CoverageReporter.prototype.log = function(entry) {
	// Поддать бутстрапа
	var hitClass;
	if (typeof(entry.hit) === 'undefined') {
		hitClass = entry.hit = '';
	} else if (entry.hit === 0) {
		this.sloc++;
		this.misses++;
		hitClass = 'class="danger"';
	} else {
		this.sloc++;
		this.hits++;
		hitClass = 'class="success"';
	}
	var logline = [];
	logline.push('<tr ' + hitClass + '>');
	logline.push('<td>' + entry.lineNumber + '</td>');
	logline.push('<td>' + entry.hit + '</td>');
	logline.push('<td style="border-top:none;white-space:pre">' + entry.code + '</td>');
	logline.push('</tr>');
	this.output += logline.join('');
};

Indigo.Tests.CoverageReporter.prototype._injectResults = function() {
	
	var coverageRatio = 0, coverageClass = 'class="text-danger"';
	
	if (this.sloc > 0) {
		coverageRatio = (this.hits / this.sloc) * 100;
		if (coverageRatio > 75) { coverageClass = 'class="text-warning"'; }
		if (coverageRatio > 90) { coverageClass = 'class="text-success"'; }
	}
	
	var summary = [];
	summary.push('<div class="panel"><h3>Summary:');
	summary.push('<span ' + coverageClass + '>Coverage: ' + (Math.round(coverageRatio * 10) / 10) + '%</span>');
	summary.push('<span ' + coverageClass + '>SLOC: ' + this.sloc + '</span>');
	summary.push('<span>Timing: ' + (this.timeFinish - this.timeStart) + ' ms.</span>');
	summary.push('</h3></div>');
	return summary;
};
