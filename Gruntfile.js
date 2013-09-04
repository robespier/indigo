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
					'include/Base.jsx',
					'include/BaseImposer.jsx',
					'include/AssemblyImposer.jsx',
					'include/AchtungImposer.jsx',
					'include/MatchingImposer.jsx',
					'include/DataBroker.jsx',
					'include/JsonBroker.jsx'
				],
				dest: 'include/<%= pkg.name %>.jsxinc'
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
				predef: [
					'app',
					'File',
					'Folder',
					'UserInteractionLevel'
				],
				sub: true,
				undef: true,
				unused: true,
				globals: {}
			},
			estk: {
				src: ['<%= concat.estk.dest %>'],
				options : {
					unused: false,
				},
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
				src: ['<%= concat.estk.dest %>'],
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
		sed: {
			// Как обмануть JSHint и JSDoc по теме расширенного JavaScript
			// от Adobe? Конкретнее: как игнорировать конструкции типа
			// "#target Illustrator" или "#include filename.jscinx"?
			// Пока не придумал ничего лучшего, чем закомментировать их в
			// исходниках тремя слэшами, а последним проходом Гранта
			// убирать эти слеши нахрен. Топорно, но волки сыты.
			dist: {
				path: '<%= concat.estk.dest %>',
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
	grunt.loadNpmTasks('grunt-sed');

	// Default task.
	grunt.registerTask('docs', ['env', 'jsdoc:dist']);
	grunt.registerTask('getexp', ['env', 'concat:exp', 'jsdoc:exp', 'jshint:exp']);
	grunt.registerTask('default', ['env', 'concat:estk', 'jsdoc:dist', 'jshint:estk', 'sed:dist']);
};
