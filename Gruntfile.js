/*global module:false*/
module.exports = function(grunt) {

	// Project configuration.
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		banner: '/**\n * <%= pkg.name %> - v<%= pkg.version %> - ' +
			'<%= grunt.template.today("yyyy-mm-dd") %>\n' +
			' * Copyright (c) <%= grunt.template.today("yyyy") %> ' +
			'<%= pkg.author %>; Licensed MIT\n */\n\n',
		// Task configuration.
		concat: {
			options: {
				banner: '<%= banner %>',
				separator: '\n'
			},
			estk: {
				// Очередность файлов важна, поэтому они перечисляются явно
				src: [
					'include/DataBroker.jsx',
					'include/JsonBroker.jsx'
				],
				dest: 'include/<%= pkg.name %>.jsxincl'
			},
			exp: {
				src: ['tmp/jsExp-*.js'],
				dest: 'tmp/jsExp.js',
			},
		},
		jshint: {
			options: {
				boss: true,
				browser: true,
				curly: true,
				eqeqeq: true,
				eqnull: true,
				immed: true,
				latedef: true,
				newcap: true,
				noarg: true,
				// Illustrator stuff, not known by JSHint:
				predef: ['app','UserInteractionLevel'],
				sub: true,
				undef: true,
				unused: true,
				globals: {}
			},
			estk: {
				src: ['<%= concat.estk.src %>']
			},
			exp: {
				src: ['<%= concat.exp.dest %>'],
				options : {
					unused: false,
				},
			},
		},
		env: {
			// Ради jsdoc
			docs: {
				// Фи! Зато быстро :)
				// @todo: Определять самостоятельно, если есть возможность
				JAVA_HOME : '/usr/lib/jvm/java-7-openjdk-i386/',
			},
		},
		jsdoc: {
			dist: {
				src: ['include/*.jsx', 'bin/*.{js,jsx}'],
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
		watch: {
			estk: {
				files: '<%= concat.estk.src %>',
				tasks: ['concat', 'jshint']
			},
			jsdoc: {
				files: '<%= jsdoc.dist.src %>',
				tasks: 'docs',
			},
			exp: {
				files: '<%= concat.exp.src %>',
				tasks: 'getexp',
			},
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
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-qunit');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-jsdoc');
	grunt.loadNpmTasks('grunt-env');

	// Default task.
	//grunt.registerTask('default', ['jshint', 'qunit', 'concat', 'uglify']);
	grunt.registerTask('docs', ['env', 'jsdoc:dist']);
	grunt.registerTask('getexp', ['env', 'concat:exp', 'jsdoc:exp', 'jshint:exp']);
	grunt.registerTask('default', ['concat', 'jshint']);

};
