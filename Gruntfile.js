module.exports = function(grunt){
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        html2js: {
            app: {
                options:{
                    base: 'src/app',
                    process: true
                },
                src: 'src/app/**/*.tpl.html',
                dest: 'dist/manage-templates.js',
                module: 'manage.templates'
            }
        },
        concat: {
            dist: {
                src: ['src/app/**/*.js'],
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
        }
    });

    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-html2js');

    grunt.registerTask('default', ['html2js', 'concat']);
};