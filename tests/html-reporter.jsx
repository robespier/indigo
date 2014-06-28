Indigo.Tests.HtmlReporter = function() {
};

Indigo.Tests.HtmlReporter.prototype.start = function() {
	this.output = new File('../tests/reports/estk/index.html');
	if (!this.output.parent.exists) {
		this.output.parent.create();
	}
	this.output.open('w');
	this.addHeader();
};

Indigo.Tests.HtmlReporter.prototype.finish = function() {
	this.addFooter();
	this.output.close();
};

Indigo.Tests.HtmlReporter.prototype.addHeader = function() {
	this.output.writeln('<!DOCTYPE html>');
	this.output.writeln('<html>');
	this.output.writeln('<head>');
	this.output.writeln('<meta http-equiv="content-type" content="text/html; charset=UTF-8">');
	this.output.writeln('<title>Indigo TestRunner report</title>');
	this.output.writeln('<link rel="stylesheet" href="bootstrap.css">');

	this.output.writeln('</head>');
	this.output.writeln('<body>');
	this.output.writeln('<div class="container">');
	this.output.writeln('<h1>Host: ' + $.getenv('computername') + ', time: ' + new Date() + '</h1>');
	this.output.writeln('<table class="table table-condensed">');
};

Indigo.Tests.HtmlReporter.prototype.addFooter = function() {
	this.output.writeln('</table>');
	this.output.writeln('</div>');
	this.output.writeln('</body>');
	this.output.writeln('</html>');
};

Indigo.Tests.HtmlReporter.prototype.log = function(entry) {
	// Отчет будем делать только для всех тестов
	// Результаты одного теста можно и в консоли посмотреть
	if (!this.allTests) { 
		return;
	}
	var statusClass = 'danger';
	if (entry.result === Indigo.Tests.PASS) {
		statusClass = 'success';
	}
	var logline = [];
	logline.push('<tr class="' + statusClass + '">');
	logline.push('<td class="test--status">' + entry.result + '</td>');
	logline.push('<td class="test--name">' + entry.name + '</td>');
	logline.push('<td class="test--message">' + entry.message + '</td>');
	logline.push('</tr>');
	this.output.writeln(logline.join(''));
};
