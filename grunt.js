module.exports = function(grunt) {

    var sources = [
        './dist/datagate.js'
    ];

    var tasks = 'lint min';

    grunt.initConfig({
        lint: {
            files : sources
        },
        min: {
            'datagate.min.js': sources
        }
    });

    grunt.registerTask('default', tasks);
};