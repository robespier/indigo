/*global module:false*/
module.exports = function(grunt) {

	// Project configuration.
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
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
					'HttpConnection',
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
					'bin/mb.jsx',
				],
				options : {
					unused: false,
				},
			}
		},
		watch: {
			estk: {
				files: '<%= jshint.estk.src %>',
				tasks: ['jshint']
			}
			/**
			 * С сетевого диска не работает;
			 * С локального работает, но тогда теряет смысл;
			 * Пока запускать из-под windows вручную: grunt 
			windows: {
				files: ['W:/gruntwatch/*.js'],
				tasks: ['default'],
			},
			*/
		}
	});

	// These plugins provide necessary tasks.
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-watch');

	// Default task.
	grunt.registerTask('default', ['jshint:estk']);
};
