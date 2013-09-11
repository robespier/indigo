/*global module:false*/
module.exports = function(grunt) {

	// Project configuration.
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		banner: '/**\n * <%= pkg.name %> - v<%= pkg.version %> - ' +
			'<%= grunt.template.today("yyyy-mm-dd") %>\n' +
			' * Copyright (c) <%= grunt.template.today("yyyy") %> ' +
			'<%= pkg.author %>; Licensed MIT\n */\n\n',
		// Custom properties
		adobe_startup: "/Adobe/Startup Scripts CS3/Adobe Bridge",
		// Task configuration.
		concat: {
			// Очередность файлов важна, поэтому они перечисляются явно
			options: {
				banner: '<%= banner %>',
				separator: '\n'
			},
			estk: {
				src: [
					'include/Base.jsx',
					'include/BaseImposer.jsx',
					'include/AssemblyImposer.jsx',
					'include/AchtungImposer.jsx',
					'include/MatchingImposer.jsx'
				],
				dest: 'include/<%= pkg.name %>-ill.jsxinc'
			},
			utils: {
				// Это дело будет грузиться в Бридж при запуске оного
				src: [
					'include/Utils.jsx',
					'include/IndigoBridgeBridgeTalk.jsx',	
					'include/IndigoMessenger.jsx',
					'include/Job.jsx',
					'include/DataBroker.jsx',
					'include/JsonBroker.jsx'
					],
				dest: 'include/<%= pkg.name %>-utils.jsxinc'
			},
			tests_ill: {
				src: [
					'tests/testSuite.jsx',
					'tests/testsIllInclude.jsx',
					'tests/*.jsxinc',
					'tests/testRun.jsx'
				],
				dest: 'tests/tests-ill.js',
			},
			tests: {
				src: [
					'tests/testSuite.jsx',
					'tests/testsUtilsInclude.jsx',
					'tests/utilsTests/*.jsxinc',
					'tests/testRun.jsx'
				],
				dest: 'tests/tests.js',
			},
		},
		jshint: {
			options: {
				boss: true,
				browser: true,
				curly: true,
				eqeqeq: true,
				eqnull: true,
				evil: true,
				expr: true,
				immed: true,
				jquery: true,
				latedef: true,
				newcap: true,
				noarg: true,
				// Illustrator stuff, not known by JSHint:
				predef: [
					'app',
					'BridgeTalk',
					'Document',
					'ExternalObject',
					'File',
					'Folder',
					'Layer',
					'PathItem',
					'PDFSaveOptions',
					'SaveOptions',
					'Socket',
					'UserInteractionLevel',
					'ZOrderMethod',
				],
				sub: true,
				undef: true,
				unused: true,
				globals: {}
			},
			estk: {
				src: [
					'<%= concat.estk.dest %>',
					'<%= concat.utils.dest %>'
				],
				options : {
					unused: false,
				},
			},
			tests: {
				src: ['<%= concat.tests.dest %>'],
			},
		},
		env: {
			// jsdoc вяло тербует пеменную среды JAVA_HOME
			// Фи! Зато быстро :)
			// @todo: Определять путь самостоятельно, если есть возможность
			linux: {
				JAVA_HOME : '/usr/lib/jvm/java-7-openjdk-i386/',
			},
			windows: {
				JAVA_HOME : 'D:/bin/Java/jre7/',
			},
		},
		jsdoc: {
			dist: {
				src: ['<%= jshint.estk.src %>'],
				options: {
					destination: 'docs/<%= pkg.name %>',
					configure: 'jsdoc.conf.json',
				},
			},
			exp: {
				src: '<%= jshint.exp.src %>',
				options: {
					destination: 'docs/<%= pkg.name %>',
				},
			},
		},
		copy: {
			bridgeTalk: {
				files: [
					{
						expand: true,
						cwd: 'include/',
						src: 'indigo-utils.jsxinc',
						dest: process.env.CommonProgramFiles + '<%= adobe_startup %>',
						// Стартап Бриджа игнорирует .jsxinc, так что расширение меняем
						ext: '.jsx'
					},
				]
			},
		},
		sed: {
			// Как обмануть JSHint и JSDoc по теме расширенного JavaScript
			// от Adobe? Конкретнее: как игнорировать конструкции типа
			// "#target Illustrator" или "#include filename.jscinx"?
			// Пока не придумал ничего лучшего, чем закомментировать их в
			// исходниках тремя слэшами, а последним проходом Гранта
			// убирать эти слеши нахрен. Топорно, но волки сыты.
			dist: {
				path: [
					'<%= concat.utils.dest %>',
					'<%= concat.estk.dest %>',
					'<%= concat.tests_ill.dest %>',
					'<%= concat.tests.dest %>',
				],
				pattern: '///#',
				replacement: '#',
			},
		},
		watch: {
			estk: {
				files: '<%= concat.estk.src %>',
				tasks: ['concat', 'jshint']
			},
			jsdoc: {
				files: '<%= jsdoc.dist.src %>',
				tasks: 'docs',
			},
			/**
			 * С сетевого диска не работает;
			 * С локального работает, но тогда теряет смысл;
			 * Пока запускать из-под windows вручную: grunt 
			windows: {
				files: ['W:/gruntwatch/*.js'],
				tasks: ['default'],
			},
			*/
		},
		qunit: {
			files: ['test/**/*.html']
		},
		uglify: {
			options: {
				banner: '<%= banner %>'
			},
			dist: {
				src: '<%= concat.dist.dest %>',
				dest: 'dist/FILE_NAME.min.js'
			}
		}
	});

	// These plugins provide necessary tasks.
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-qunit');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-jsdoc');
	grunt.loadNpmTasks('grunt-env');
	grunt.loadNpmTasks('grunt-sed');

	// OS specific tasks
	var envTasks = [];
	if (process.env.OS === 'Windows_NT') {
		envTasks.push('env:windows');
		envTasks.push('copy:bridgeTalk');
	} else {
		envTasks.push('env:linux');
	}
	grunt.registerTask('os_spec', envTasks);

	grunt.registerTask('docs', ['os_spec', 'jsdoc:dist']);
	grunt.registerTask('tests', ['concat', 'jshint', 'sed']);
	// Default task.
	grunt.registerTask('default', ['concat', 'os_spec', 'jsdoc:dist', 'jshint:estk', 'sed']);
};
