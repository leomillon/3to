module.exports = function(grunt) {

    // Project configuration
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        projectName: '<%= pkg.name %>',
        projectNameVersion: '<%= pkg.name %>-<%= pkg.version %>',
        defaultBanner: '/*!\n * <%= pkg.name %> v<%= pkg.version %>\n * <%= pkg.author %>\n * <%= grunt.template.today("yyyy-mm-dd") %>\n */',
        jshint: {
            // define the files to lint
            all: ['Gruntfile.js', 'game/*.js', 'routes/*.js', 'resources/js/*.js'],
            options: {
                jshintrc: '.jshintrc'
            }
        },
        uglify: {
            main: {
                files: {
                    'temp/js/game-<%= pkg.version %>.min.js': ['temp/js/game-<%= pkg.version %>.js']
                }
            }
        },
        less: {
            dev: {
                files: {
                    'temp/css/styles-<%= pkg.version %>.css': 'resources/less/styles.less'
                }
            },
            prod: {
                options: {
                    cleancss: true,
                    compress: true
                },
                files: {
                    'temp/css/styles-<%= pkg.version %>.min.css': 'resources/less/styles.less'
                }
            }
        },
        usebanner: {
            options: {
                position: 'top',
                banner: '<%= defaultBanner %>',
                linebreak: true
            },
            main: {
                files: {
                    src: ['temp/css/*.css', 'temp/js/*.js']
                }
            }
        },
        clean: {
            all: ['temp', 'public'],
            temp: ['temp'],
            dist: ['public']
        },
        concat: {
            project: {
                files: {
                    'temp/js/game-<%= pkg.version %>.js': [
                        'resources/js/common.js',
                        'resources/js/game.js'
                    ]
                }
            },
            global: {
                files: {
                    'public/css/<%= projectNameVersion %>.css': [
                        'resources/lib/css/bootstrap.min.css',
                        'resources/lib/css/bootstrap-theme.min.css',
                        'temp/css/styles-<%= pkg.version %>.css'
                    ],
                    'public/css/<%= projectNameVersion %>.min.css': [
                        'resources/lib/css/bootstrap.min.css',
                        'resources/lib/css/bootstrap-theme.min.css',
                        'temp/css/styles-<%= pkg.version %>.min.css'
                    ],
                    'public/js/<%= projectNameVersion %>.js': [
                        'resources/lib/js/jquery-1.11.0.min.js',
                        'resources/lib/js/bootstrap.min.js'
                    ],
                    'public/js/<%= projectNameVersion %>.min.js': [
                        'resources/lib/js/jquery-1.11.0.min.js',
                        'resources/lib/js/bootstrap.min.js'
                    ]
                }
            }
        },
        copy: {
            main: {
                files: [
                    { expand: true, cwd: 'temp/js/', src: ['**'], dest: 'public/js/' },
                    { expand: true, cwd: 'resources/images/', src: ['**'], dest: 'public/images/' },
                    { expand: true, cwd: 'resources/lib/fonts/', src: ['**'], dest: 'public/fonts/' }
                ]
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-banner');

    grunt.registerTask('default', [
        'jshint:all',
        'clean:all',
        'less:dev',
        'less:prod',
        'concat:project',
        'uglify',
        'usebanner:main',
        'concat:global',
        'copy',
        'clean:temp'
    ]);

};