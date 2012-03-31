var validator = require('../../lib/validator');
var validCheck = require('./validator_check').valid;
var invalidCheck = require('./validator_check').invalid;

var valids = [ 10, 0, -12345 ];
var invalids = [ 1.23, -4.5, 'foo', true, {}, function () {}, [10, 20], NaN, '', null, undefined ];

describe('isInteger validator', function() {

    var isInteger = validator.isInteger;

    valids.forEach(function (val) {
        validCheck(isInteger, val);
    });

    invalids.forEach(function (val) {
        invalidCheck(isInteger, val);
    });
});

describe('isInteger validator', function() {

    var notInteger = validator.notInteger;

    valids.forEach(function (val) {
        invalidCheck(notInteger, val);
    });

    invalids.forEach(function (val) {
        validCheck(notInteger, val);
    });
});
