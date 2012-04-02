var validator = require('../../lib/validator');
var validCheck = require('./validator_check').valid;
var invalidCheck = require('./validator_check').invalid;

var valids = [ 10, 1.23, -4.5, '6.78', '-9.0', 1e+21, -2e+34, '3e-45' ];
var invalids = [ 'foo', true, {}, function () {}, [10, 20], NaN, '', null, undefined ];

describe('isDecimal validator', function() {

    var isDecimal = validator.isDecimal;

    valids.forEach(function (val) {
        validCheck(isDecimal, val);
    });

    invalids.forEach(function (val) {
        invalidCheck(isDecimal, val);
    });
});

describe('notDecimal validator', function() {

    var notDecimal = validator.notDecimal;

    valids.forEach(function (val) {
        invalidCheck(notDecimal, val);
    });

    invalids.forEach(function (val) {
        validCheck(notDecimal, val);
    });
});
