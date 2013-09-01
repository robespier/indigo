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
				stripBanners: true,
				separator: '\n'
			},
			estk: {
				// Очередность файлов важна, поэтому они перечисляются явно
				src: [
					'include/DataBroker.jsx',
					'include/JsonBroker.jsx'
				],
				dest: 'include/<%= pkg.name %>.jsxincl'
			}
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
				sub: true,
				undef: true,
				unused: true,
				globals: {}
			},
			estk: {
				src: ['<%= concat.estk.src %>']
			},
		},
		watch: {
			estk: {
				files: '<%= concat.estk.src %>',
				tasks: ['concat', 'jshint']
			}
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

	// Default task.
	//grunt.registerTask('default', ['jshint', 'qunit', 'concat', 'uglify']);
	grunt.registerTask('default', ['concat', 'jshint']);

};
