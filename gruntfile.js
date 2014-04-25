'use strict';

module.exports = function (grunt) {

	grunt.initConfig({
		jslint: {
			client: {
				src: ['assets/**/*.js'],
				directives: {
					white: true,
					vars: true,
					nomen: true,
					browser: true
				}
			},
			server: {
				src: ['src/**/*.js', '*.js', 'bin/**/*.js', 'routes/**/*.js'],
				directives: {
					white: true,
					vars: true,
					nomen: true,
					node: true,
					unparam: true
				}
			}
		},
		uglify: {
			globalScripts: {
				files: [
					{
						expand: true,
						cwd: 'assets/js/global',
						src: '**/*.js',
						dest: 'temp/assets/js/global'
					}
				]
			},
			localScripts: {
				files: [
					{
						expand: true,
						cwd: 'assets/js/local',
						src: '**/*.js',
						dest: 'public/js/local'
					}
				]
			},
			underscore: {
				files: [
					{
						src: 'bower_components/underscore/underscore.js',
						dest: 'bower_components/underscore/underscore.min.js'
					}
				]
			}
		},
		copy: {
			localScripts: {
				files: [
					{
						expand: true,
						cwd: 'assets/js/local',
						src: '**/*.js',
						dest: 'public/js/local'
					}
				]
			}
		},
		csscomb: {
			options: {
				config: 'csscomb.config.json'
			},
			dev: {
				files: [
					{
						expand: true,
						cwd: 'assets/less',
						src: '**/*.less',
						dest: 'assets/less'
					}
				]
			}
		},
		less: {
			options: {
				paths: 'bower_components/lesshat/build'
			},
			dev: {
				files: [
					{
						expand: true,
						cwd: 'assets/less',
						src: '**/*.less',
						dest: 'temp/assets/css',
						ext: '.css'
					}
				]
			},
			prod: {
				options: {
					cleancss: true,
					compress: true
				},
				files: [
					{
						expand: true,
						cwd: 'assets/less',
						src: '**/*.less',
						dest: 'temp/assets/css',
						ext: '.css'
					}
				]
			}
		},
		csslint: {
			options: {
				'box-sizing': false
			},
			temp: {
				src: ['temp/assets/css/**/*.css']
			}
		},
		concat: {
			devGlobalScripts: {
				src: ['bower_components/jquery/dist/jquery.js',
					'bower_components/log4javascript/log4javascript_uncompressed.js',
					'bower_components/underscore/underscore.js',
					'assets/js/global/**/*.js'],
				dest: 'public/js/global/globalScripts.js'
			},
			prodGlobalScripts: {
				src: ['bower_components/jquery/dist/jquery.min.js',
					'bower_components/log4javascript/log4javascript.js',
					'bower_components/underscore/underscore.min.js',
					'temp/assets/js/global/**/*.js'],
				dest: 'public/js/global/globalScripts.js'
			},
			devCss: {
				src: ['bower_components/bootstrap/dist/css/bootstrap.css',
					'temp/assets/**/*.css'],
				dest: 'public/css/styles.css'
			},
			prodCss: {
				src: ['bower_components/bootstrap/dist/css/bootstrap.min.css',
					'temp/assets/**/*.css'],
				dest: 'public/css/styles.css'
			}
		},
		clean: {
			temp: {
				src: ['temp']
			},
			build: {
				src: ['public/css', 'public/js']
			}
		},
		bump: {
			options: {
				files: ['package.json', 'bower.json'],
				commit: false,
				push: false,
				createTag: false
			}
		},
		watch: {
			files: ['assets/**', 'src/**/*.js', '*.js', 'bin/**/*.js', 'routes/**/*.js'],
			tasks: ['lint']
		}
	});

	grunt.loadNpmTasks('grunt-jslint');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-less');
	grunt.loadNpmTasks('grunt-csscomb');
	grunt.loadNpmTasks('grunt-contrib-csslint');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-bump');

	/**
	 * CssComb less. Linting js and css.
	 * v0.0.0-0 => 0.0.0-1
	 */
	grunt.registerTask('lint', ['clean:temp', 'jslint', 'csscomb', 'less:dev', 'csslint', 'bump:build']);

	/**
	 * Concatenates global scripts (assets + libs) without uglification to public/js/globalScripts.js.
	 * Copies local scripts to public/js/local/
	 * Compiles less. Concatenates all css files without minification to public/css/styles.css.
	 * v0.0.0-0 => 0.0.1-0
	 */
	grunt.registerTask('dev', ['lint', 'clean', 'concat:devGlobalScripts', 'copy:localScripts', 'less:dev', 'concat:devCss', 'bump:patch']);

	/**
	 * Same as 'dev' + js uglification, css minification.
	 * v0.0.0-0 => 0.1.0-0
	 */
	grunt.registerTask('prod', ['lint', 'clean', 'uglify', 'concat:prodGlobalScripts', 'less:prod', 'concat:prodCss', 'bump:minor']);

	grunt.registerTask('default', 'watch');
};