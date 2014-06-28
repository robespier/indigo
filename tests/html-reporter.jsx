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
	this.output.writeln('<table>');
};

Indigo.Tests.HtmlReporter.prototype.addFooter = function() {
	this.output.writeln('</table>');
};

Indigo.Tests.HtmlReporter.prototype.log = function(entry) {
	// Отчет будем делать только для всех тестов
	// Результаты одного теста можно и в консоли посмотреть
	if (!this.allTests) { 
		return;
	}
	var statusClass = 'test--fail';
	if (entry.result === Indigo.Tests.PASS) {
		statusClass = 'test--pass';
	}
	var logline = [];
	logline.push('<tr class="' + statusClass + '">');
	logline.push('<td class="test--status">' + entry.result + '</td>');
	logline.push('<td class="test--name">' + entry.name + '</td>');
	logline.push('<td class="test--message">' + entry.message + '</td>');
	logline.push('</tr>');
	this.output.writeln(logline.join(''));
};
