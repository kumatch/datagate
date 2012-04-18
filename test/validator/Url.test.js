var validator = require('../../lib/validator');
var validCheck = require('./validator_check').valid;
var invalidCheck = require('./validator_check').invalid;

var valids = [ 'http://example.com/', 'https://example.com/path/to/page.html' ];
var invalids = [ 'foo', 10, -20, 3.4, { bar: 123 }, function () {}, [10, 20], true, '', null, undefined, NaN ];

describe('isUrl validator', function() {

    var isUrl = validator.isUrl;

    valids.forEach(function (val) {
        validCheck(isUrl, val);
    });

    invalids.forEach(function (val) {
        invalidCheck(isUrl, val);
    });
});


describe('notUrl validator', function() {

    var notUrl = validator.notUrl;

    invalids.forEach(function (val) {
        validCheck(notUrl, val);
    });

    valids.forEach(function (val) {
        invalidCheck(notUrl, val);
    });
});
