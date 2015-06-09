module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({

        pkg: grunt.file.readJSON('package.json'),

        jshint: {
            options: {
                jshintrc: '.jshintrc'
            },
            all: ['Gruntfile.js', 'backbone.dominus.js', 'tests/**/*.js']
        },

        qunit: {
            options: {
                coverage: {
                    coberturaReport: 'report/',
                    disposeCollector: true,
                    htmlReport: 'report/coverage',
                    instrumentedFiles: 'temp/',
                    src: ['backbone.dominus.js']
                }
            },
            all: ['tests/qunit/index.html']
        }

    });

    // Load plugin tasks.
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-qunit-istanbul');

    // Default task(s).
    grunt.registerTask('test', ['jshint', 'qunit']);
    grunt.registerTask('default', ['test']);

};
