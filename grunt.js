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

        min: {
            dist: {
                src: sources,
                dest: './minify/datagate.min.js'
            }
        }
    });

    grunt.registerTask('default', "lint min");
};