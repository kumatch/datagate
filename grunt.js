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
                dest: './lib/datagate.all.js'
            }
        },

        min: {
            dist: {
                src: './lib/datagate.all.js',
                dest: './minify/datagate.min.js'
            }
        }
    });

    grunt.registerTask('default', "lint concat min");
};