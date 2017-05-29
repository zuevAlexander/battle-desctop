'use strict';

// common globbing patterns
// '*'        matches any number of characters, but not /
// '?'        matches a single character, but not /
// '**'       matches any number of characters, including /, as long as it's the only thing in a path part
// '{}'       allows for a comma-separated list of "or" expressions
// '!'        at the beginning of a pattern will negate the match
// '/{,*/}*'  matches files one level down
// '/**/*'    recursively matches files in all subfolders

module.exports = function (grunt) {

    // Load grunt tasks automatically
    require('load-grunt-tasks')(grunt);

    // Time how long tasks take. Can help when optimizing build times
    require('time-grunt')(grunt);

    // Define the configuration for all the tasks
    grunt.initConfig({

        // define project-specific settings (grunt templates)
        paths: {
            app: 'src',
            dist: 'app',
            temp: '.tmp'
        },

        // empty folders to start fresh
        clean: {
            dist: ['<%= paths.dist %>', '<%= paths.temp %>'],
            dev: '<%= paths.temp %>'
        },

        // compile Sass to CSS and generate necessary files if requested
        compass: {
            options: {
                require: ['compass-h5bp'],
                sassDir: '<%= paths.app %>/styles',
                imagesDir: '<%= paths.app %>/images',
                generatedImagesDir: '<%= paths.temp %>/images/generated',
                javascriptsDir: '<%= paths.app %>/scripts',
                fontsDir: '<%= paths.app %>/fonts',
                cssDir: '<%= paths.temp %>/styles',
                httpImagesPath: '/images',
                httpGeneratedImagesPath: '/images/generated',
                httpFontsPath: '/fonts',
                relativeAssets: false,
                noLineComments: false,
                assetCacheBuster: false
            },
            dev: {
                options: {
                    debugInfo: true
                }
            },
            dist: {
                options: {
                    // environment: 'production', // minify CSS
                    generatedImagesDir: '<%= paths.dist %>/images/generated'
                }
            }
        },

        // run blocking tasks in parallel
        concurrent: {
            dev: [
                'sass:dev'
            ],
            test: [],
            dist: [
                'sass:dist'
            ]
        },

        // start static web server
        connect: {
            options: {
                port: 9000,
                livereload: 35729
            },
            dev: {
                options: {
                    open: true,
                    base: [
                        '<%= paths.temp %>',
                        '<%= paths.app %>'
                    ]
                }
            },
            dist: {
                options: {
                    open: true,
                    base: '<%= paths.dist %>'
                }
            },
            test: {
                options: {
                    port: 9001,
                    base: [
                        '<%= paths.temp %>',
                        '<%= paths.app %>',
                        'test'
                    ]
                }
            }
        },

        // copy files to places other tasks can use
        copy: {
            dist: {
                files: [{
                    expand: true,
                    dot: true,
                    cwd: '<%= paths.app %>/',
                    src: [
                        '*.{ico,png,txt}',
                        '**/*.html',
                        'images/{,*/}*.{webp}',
                        'fonts/*'
                    ],
                    dest: '<%= paths.dist %>'
                }, {
                    expand: true,
                    cwd: '<%= paths.temp %>/images/generated/',
                    src: ['**'],
                    dest: '<%= paths.dist %>/images/'
                }, {
                    expand: true,
                    cwd: '<%= paths.app %>/images/',
                    src: ['*'],
                    dest: '<%= paths.dist %>/images/'
                },  {
                    expand: true,
                    cwd: '<%= paths.temp %>/styles/',
                    src: ['**'],
                    dest: '<%= paths.dist %>/styles/'
                }, {
                    expand: true,
                    cwd: '<%= paths.temp %>/concat/scripts/',
                    src: ['**'],
                    dest: '<%= paths.dist %>/scripts/'
                }, {
                    expand: true,
                    cwd: 'bower_components/angular-dragdrop/src/',
                    src: ['angular-dragdrop.js'],
                    dest: '<%= paths.dist %>/scripts/'
                }]
            }
        },

        // ensure proper coding styles
        jshint: {
            options: {
                jshintrc: '.jshintrc',
                reporter: require('jshint-stylish')
            },
            dev: [
                '<%= paths.app %>/scripts/**/*.js'
            ],
            gruntfile: [
                'Gruntfile.js'
            ],
            test: [
                '<%= paths.test %>/spec/**/*.js'
            ]
        },

        // allow the use of non-minsafe AngularJS files. automatically makes it
        // minsafe compatible so Uglify does not destroy the ng references
        ngmin: {
            dist: {
                files: [
                    {
                        expand: true,
                        cwd: '<%= paths.temp %>/concat/scripts',
                        src: '*.js',
                        dest: '<%= paths.temp %>/concat/scripts'
                    }
                ]
            }
        },

        // rename files for browser caching purposes
        rev: {
            dist: {
                files: {
                    src: [
                        '<%= paths.dist %>/scripts/{,*/}*.js',
                        '<%= paths.dist %>/styles/{,*/}*.css'
                        //'<%= paths.dist %>/images/**/*.{png,jpg,jpeg,gif,webp,svg}'
                    ]
                }
            }
        },

        // set Sass configurations
        sass: {
            dist: {
                files: [{
                    expand: true,
                    cwd: '<%= paths.app %>/styles',
                    src: ['**/*.scss'],
                    dest: '<%= paths.temp %>/styles',
                    ext: '.css'
                }]
            },
            dev: {
                files: [{
                    expand: true,
                    cwd: '<%= paths.app %>/styles',
                    src: ['**/*.scss'],
                    dest: '<%= paths.temp %>/styles',
                    ext: '.css'
                }]
            }
        },

        // read HTML for usemin blocks to enable smart builds that automatically
        // concat, minify and revision files. create configurations in memory so
        // additional tasks can operate on them
        useminPrepare: {
            options: {
                root: '<%= paths.app %>',
                dest: '<%= paths.dist %>'
            },
            html: '<%= paths.app %>/**/*.html'
        },

        // perform rewrites based on rev and the useminPrepare configuration
        usemin: {
            html: [
                '<%= paths.dist %>/**/*.html'
            ],
            css: ['<%= paths.dist %>/styles/{,*/}*.css']
        },

        // watch files for changes and run tasks based on the changed files
        watch: {
            options: {
                spawn: false,
                livereload: true
            },

            // clear the terminal window and run jshint on app javascript files
            jshint: {
                options: {
                    reporter: require('jshint-stylish')
                },
                files: ['<%= paths.app %>/scripts/**/*.js'],
                tasks: ['clear', 'jshint:dev']
            },

            // compile CSS when Sass files are changed
            compass: {
                files: ['<%= paths.app %>/styles/**/*.{scss,sass}'],
                tasks: ['compass:dev']
            },

            // run jshint on this Grunt configuration file
            gruntfile: {
                files: ['Gruntfile.js'],
                tasks: ['jshint:gruntfile']
            },

            // reload the browser when changes are made
            livereload: {
                files: [
                    '<%= paths.app %>/**/*.html',
                    '<%= paths.app %>/scripts/**/*.js',
                    '<%= paths.temp %>/styles/{,*/}*.css',
                    '<%= paths.app %>/images/**/*.{png,jpg,jpeg,gif,webp,svg}'
                ]
            }
        }
    });


    // run development instance
    grunt.registerTask('dev', function (target) {
        if (target === 'dist') {
            return grunt.task.run(['dist', 'connect:dist:keepalive']);
        }

        grunt.task.run([
            'clear',
            'clean:dev',
            'concurrent:dev',
            'connect:dev',
            'watch'
        ]);
    });

    // build and deploy production instance
    grunt.registerTask('dist', [
        'clear',
        'clean:dist',
        'useminPrepare',
        'concurrent:dist',
        'concat',
        'ngmin',
        'copy:dist',
        'rev',
        'usemin'
    ]);
};
