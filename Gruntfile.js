module.exports = function(grunt){
    // Load all tasks
    require('load-grunt-tasks')(grunt);
    // Show elapsed time
    require('time-grunt')(grunt);

    var jsFileList = [
        'dist/manage.js'
    ];
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        jshint: {
            options: {
                jshintrc: '.jshintrc',
                reporterOutput: ""
            },
            all: [
                'Gruntfile.js',
                'src/*.js',
                '!dist/*.js'
            ]
        },
        html2js: {
            app: {
                options:{
                    base: 'src/app',
                    process: true
                },
                src: 'src/app/**/*.tpl.html',
                dest: 'tmp/templates.js',
                module: 'manage.templates'
            }
        },
        concat: {
            dist: {
                src: ['tmp/templates.js', 'src/app/**/*.js'],
                dest: 'dist/manage.js'
            },
            index: {
                src: 'src/index.html',
                dest: 'dist/index.html',
                options: {
                    process: true
                }
            },
            css: {
                src: ['src/**/*.css'],
                dest: 'dist/manage.css'
            }
        },
        clean: {
            app: ['tmp/']
        },
        bump: {
            options: {
                files: ['package.json', 'bower.json'],
                updateConfigs: ['pkg'],
                commit: false,
                commitMessage: 'Release v%VERSION%',
                commitFiles: ['package.json', 'bower.json'],
                createTag: true,
                tagName: 'v%VERSION%',
                tagMessage: 'Version %VERSION%',
                push: false,
                pushTo: 'origin',
                gitDescribeOptions: '--tags --always --abbrev=1 --dirty=-d',
                globalReplace: false,
                prereleaseName: false,
                regExp: false
            }
        },
        uglify: {
            options: {
                mangle: false
            },
            dist: {
                files: {
                    'dist/manage.min.js': [jsFileList]
                }
            }
        },
        cssmin: {
            target: {
                files: [{
                    expand: true,
                    cwd: 'dist',
                    src: ['*.css', '!*.min.css'],
                    dest: 'dist',
                    ext: '.min.css'
                }]
            }
        }
    });

    grunt.registerTask('default', [
        'html2js',
        'concat',
        'clean'
    ]);
    grunt.registerTask('live-build', [
        'html2js',
        'jshint',
        'concat',
        'uglify',
        'cssmin',
        'clean'
    ]);

};