var validator = require('../../lib/validator');
var validCheck = require('./validator_check').valid;
var invalidCheck = require('./validator_check').invalid;

var valids = [ 10, -20, 3.14, 0xA, NaN ];
var invalids = [ 'foo', { bar: 123 }, function () {}, [10, 20], true, '', null, undefined ];

describe('isNumberType validator', function() {

    var isNumberType = validator.isNumberType;

    valids.forEach(function (val) {
        validCheck(isNumberType, val);
    });

    invalids.forEach(function (val) {
        invalidCheck(isNumberType, val);
    });
});


describe('notNumberType validator', function() {

    var notNumberType = validator.notNumberType;

    invalids.forEach(function (val) {
        validCheck(notNumberType, val);
    });

    valids.forEach(function (val) {
        invalidCheck(notNumberType, val);
    });
});
