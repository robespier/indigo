/**
 * @classdesc Коряво получилось.
 *
 * @todo Но на первое время сойдёт
 */
Indigo.Tests.HtmlReporter = function() {
	this.hitPass = 0;
	this.hitFail = 0;
	this.output = '';
};

Indigo.Tests.HtmlReporter.prototype.start = function(options) {
	this.suite = options.suite;
	this.report = options.name;
	this.addHeader();
	this.timeStart = new Date().getTime();
};

Indigo.Tests.HtmlReporter.prototype.finish = function() {
	this.timeFinish = new Date().getTime();
	this.addFooter();
	this._flushReport();
};

Indigo.Tests.HtmlReporter.prototype.addHeader = function() {
	var header = [];

	header.push('<!DOCTYPE html>');
	header.push('<html>');
	header.push('<head>');
	header.push('<meta http-equiv="content-type" content="text/html; charset=UTF-8">');
	header.push('<title>Indigo TestRunner report</title>');
	header.push('<link rel="stylesheet" href="bootstrap.css">');

	header.push('</head>');
	header.push('<body>');
	header.push('<div class="container">');
	header.push('<h1>Host: ' + $.getenv('computername') + ', time: ' + new Date() + '</h1>');
	header.push('<table class="table table-condensed">');

	this.header = header;
};

Indigo.Tests.HtmlReporter.prototype.addFooter = function() {
	var footer = [];

	footer.push('</table>');
	footer.push('</div>');
	footer.push('</body>');
	footer.push('</html>');

	this.footer = footer;
};

Indigo.Tests.HtmlReporter.prototype.log = function(entry) {
	// Отчет будем делать только для всех тестов
	// Результаты одного теста можно и в консоли посмотреть
	if (!this.allTests) { 
		return;
	}
	var statusClass = '';
	if (entry.result === Indigo.Tests.PASS) {
		statusClass = 'success';
		++this.hitPass;
	} else {
		statusClass = 'danger';
		++this.hitFail;
	}
	var logline = [];
	logline.push('<tr class="' + statusClass + '">');
	logline.push('<td class="test--name">' + entry.name.replace(/^test/,'') + '</td>');
	logline.push('<td class="test--message">' + entry.message + '</td>');
	logline.push('</tr>');
	this.output += logline.join('');
};

Indigo.Tests.HtmlReporter.prototype._injectResults = function() {
	// @@todo Коряво, ох коряво
	// Вынимаем из массива хидера последний элемент, который открывает рапорт
	var reportStarter = this.header.pop();

	var summary = [];
	summary.push('<div class="panel"><h3>Summary:');
	summary.push('<span class="text-success">Passed: ' + this.hitPass + '</span>');
	summary.push('<span class="text-danger">Failed: ' + this.hitFail + '</span>');
	summary.push('<span>Timing: ' + (this.timeFinish - this.timeStart) + ' ms.</span>');
	summary.push('</h3></div>');
	
	// Внедряем рапорт в хидер
	this.header = this.header.concat(summary);
	
	// Закрываем рапорт заранее сохранённым элементом
	this.header.push(reportStarter);
};

Indigo.Tests.HtmlReporter.prototype._flushReport = function() {
	this._injectResults();
	var output = new File(this.suite.testsFilesFolder + 'reports/estk/' + this.report + '.html');
	output.encoding = 'UTF-8';
	if (!output.parent.exists) {
		output.parent.create();
	}
	output.open('w');
	output.write(this.header.join('\n'));
	output.write(this.output);
	output.write(this.footer.join('\n'));
	output.close();
};
