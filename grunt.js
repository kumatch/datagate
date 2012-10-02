module.exports = function(grunt) {

    var sources = [
        './lib/plow.js',
        './lib/error.js',
        './lib/filter.js',
        './lib/validator.js',
        './lib/array.js',
        './lib/object.js',
        './lib/union.js',
        './lib/datagate.js'
    ];

    grunt.initConfig({
        lint: {
            files : sources
        },
        concat: {
            dist: {
                src: sources,
                dest: './datagate.min.js'
            }
        },

        min: {
            dist: {
                src: sources,
                dest: './datagate.min.js'
            }
        }
    });

    grunt.registerTask('default', "lint min");
};