exports.config = {
	
	specs: 'e2e/**/*.js',
	baseUrl: 'http://localhost:8080',
	capabilities: {
		'browserName': 'firefox'
	},
	framework: 'mocha',
	mochaOpts: {
		reporter: "spec",
		slow: 5000,
	}
};
