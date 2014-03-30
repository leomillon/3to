module.exports = function(grunt) {

    // Project configuration
    grunt.initConfig({
        // Variables
        pkg: grunt.file.readJSON('package.json'),
        project: {
            nameVersion: '<%= pkg.name %>-<%= pkg.version %>'
        },
        folder: {
            temp: 'temp',
            dist: 'public'
        },
        resources: {
            common: 'resources/common',
            server: 'resources/server',
            client: 'resources/client'
        },
        defaultBanner: '/*!\n * <%= pkg.name %> v<%= pkg.version %>\n * <%= pkg.author %>\n * <%= grunt.template.today("yyyy-mm-dd") %>\n */',
        // Tasks configuration
        jshint: {
            // define the files to lint
            all: [
                'Gruntfile.js',
                '<%= resources.server %>/game/*.js',
                '<%= resources.server %>/routes/*.js',
                '<%= resources.common %>/*.js',
                '<%= resources.client %>/js/*.js'
            ],
            options: {
                jshintrc: '.jshintrc'
            }
        },
        uglify: {
            main: {
                files: {
                    '<%= folder.temp %>/js/game-<%= pkg.version %>.min.js': [
                        '<%= folder.temp %>/js/game-<%= pkg.version %>.js'
                    ]
                }
            }
        },
        less: {
            dev: {
                files: {
                    '<%= folder.temp %>/css/styles-<%= pkg.version %>.css': '<%= resources.client %>/less/styles.less'
                }
            },
            prod: {
                options: {
                    cleancss: true,
                    compress: true
                },
                files: {
                    '<%= folder.temp %>/css/styles-<%= pkg.version %>.min.css': '<%= resources.client %>/less/styles.less'
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
                    src: ['<%= folder.temp %>/css/*.css', '<%= folder.temp %>/js/*.js']
                }
            }
        },
        clean: {
            all: ['<%= folder.temp %>', '<%= folder.dist %>'],
            temp: ['<%= folder.temp %>'],
            dist: ['<%= folder.dist %>']
        },
        concat: {
            project: {
                files: {
                    '<%= folder.temp %>/js/game-<%= pkg.version %>.js': [
                        '<%= resources.common %>/index.js',
                        '<%= resources.client %>/js/game.js'
                    ]
                }
            },
            global: {
                files: {
                    '<%= folder.dist %>/css/<%= project.nameVersion %>.css': [
                        '<%= resources.client %>/lib/css/bootstrap.min.css',
                        '<%= resources.client %>/lib/css/bootstrap-theme.min.css',
                        '<%= folder.temp %>/css/styles-<%= pkg.version %>.css'
                    ],
                    '<%= folder.dist %>/css/<%= project.nameVersion %>.min.css': [
                        '<%= resources.client %>/lib/css/bootstrap.min.css',
                        '<%= resources.client %>/lib/css/bootstrap-theme.min.css',
                        '<%= folder.temp %>/css/styles-<%= pkg.version %>.min.css'
                    ],
                    '<%= folder.dist %>/js/<%= project.nameVersion %>.js': [
                        '<%= resources.client %>/lib/js/jquery-1.11.0.min.js',
                        '<%= resources.client %>/lib/js/bootstrap.min.js'
                    ],
                    '<%= folder.dist %>/js/<%= project.nameVersion %>.min.js': [
                        '<%= resources.client %>/lib/js/jquery-1.11.0.min.js',
                        '<%= resources.client %>/lib/js/bootstrap.min.js'
                    ]
                }
            }
        },
        copy: {
            main: {
                files: [
                    { expand: true, cwd: '<%= folder.temp %>/js/', src: ['**'], dest: '<%= folder.dist %>/js/' },
                    { expand: true, cwd: '<%= resources.client %>/images/', src: ['**'], dest: '<%= folder.dist %>/images/' },
                    { expand: true, cwd: '<%= resources.client %>/lib/fonts/', src: ['**'], dest: '<%= folder.dist %>/fonts/' }
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