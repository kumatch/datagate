module.exports = function(grunt) {

    var sources = [
        'src/datagate.js',
        'src/filter.js',
        'src/validator.js'
    ];

    var tasks = 'lint concat min';

    grunt.initConfig({
        lint: {
            files : sources
        },
        concat:  {
            'datagate.js' : sources
        },
        min: {
            'datagate.min.js': [ 'datagate.js' ]
        }
    });

    grunt.registerTask('default', tasks);
};