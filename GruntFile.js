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
            build: {
                src: 'resources/js/scripts.js',
                dest: 'resources/js/<%= projectNameVersion %>.min.js'
            }
        },
        less: {
            dev: {
                files: {
                    'resources/css/<%= projectNameVersion %>.css': 'resources/less/styles.less'
                }
            },
            prod: {
                options: {
                    cleancss: true,
                    compress: true
                },
                files: {
                    'resources/css/<%= projectNameVersion %>.min.css': 'resources/less/styles.less'
                }
            }
        },
        usebanner: {
            options: {
                position: 'top',
                banner: '<%= defaultBanner %>',
                linebreak: true
            },
            preGeneration: {
                files: {
                    src: ['resources/css/*.css', 'resources/js/3to*.js']
                }
            },
            postGeneration: {
                files: {
                    src: ['public/js/game.js']
                }
            }
        },
        clean: {
            build: ['public', 'resources/css/*', 'resources/js/3to*.min.js']
        },
        concat: {
            dev: {
                files: {
                    'public/css/styles.css': [
                        'resources/lib/css/bootstrap.min.css',
                        'resources/lib/css/bootstrap-theme.min.css',
                        'resources/css/<%= projectNameVersion %>.css'
                    ],
                    'public/js/scripts.js': [
                        'resources/lib/js/jquery-1.11.0.min.js',
                        'resources/lib/js/bootstrap.min.js',
                        'resources/js/<%= projectNameVersion %>.min.js'
                    ]
                }
            },
            prod: {
                files: {
                    'public/css/styles.css': [
                        'resources/lib/css/bootstrap.min.css',
                        'resources/lib/css/bootstrap-theme.min.css',
                        'resources/css/<%= projectNameVersion %>.min.css'
                    ],
                    'public/js/scripts.js': [
                        'resources/lib/js/jquery-1.11.0.min.js',
                        'resources/lib/js/bootstrap.min.js',
                        'resources/js/<%= projectNameVersion %>.min.js'
                    ]
                }
            }
        },
        copy: {
            main: {
                files: [
                    { expand: true, cwd: 'resources/js/', src: ['game.js'], dest: 'public/js/' },
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

    // Default task(s).
    grunt.registerTask('dev', [
        'jshint',
        'clean',
        'uglify',
        'less:dev',
        'usebanner:preGeneration',
        'concat:dev',
        'copy',
        'usebanner:postGeneration'
    ]);
    grunt.registerTask('default', [
        'jshint',
        'clean',
        'uglify',
        'less:prod',
        'usebanner:preGeneration',
        'concat:prod',
        'copy',
        'usebanner:postGeneration'
    ]);

};