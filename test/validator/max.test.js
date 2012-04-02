var validator = require('../../lib/validator');
var validCheck = require('./validator_check').valid;
var invalidCheck = require('./validator_check').invalid;

var valids = [ 0, 100, '100', -200, 99.99 ];
var invalids = [ 'foo', 101, true, {}, function () {}, [], NaN ];

describe('max 100 validator', function() {

    var max = validator.max(100);

    valids.forEach(function (val) {
        validCheck(max, val);
    });

    invalids.forEach(function (val) {
        invalidCheck(max, val);
    });
});

describe('maximum 100 validator', function() {
    var maximum = validator.maximum(100);

    valids.forEach(function (val) {
        validCheck(maximum, val);
    });

    invalids.forEach(function (val) {
        invalidCheck(maximum, val);
    });
});
