var validator = require('../../lib/validator');
var validCheck = require('./validator_check').valid;
var invalidCheck = require('./validator_check').invalid;

var valids = [ 'foo', '123', 'http://example.com/', '' ];
var invalids = [ 1, { bar: 123 }, function () {}, [10, 20], true, NaN, null, undefined ];

describe('isStringType validator', function() {

    var isStringType = validator.isStringType;

    valids.forEach(function (val) {
        validCheck(isStringType, val);
    });

    invalids.forEach(function (val) {
        invalidCheck(isStringType, val);
    });
});


describe('notStringType validator', function() {

    var notStringType = validator.notStringType;

    invalids.forEach(function (val) {
        validCheck(notStringType, val);
    });

    valids.forEach(function (val) {
        invalidCheck(notStringType, val);
    });
});
