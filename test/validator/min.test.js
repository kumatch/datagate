var validator = require('../../lib/validator');
var validCheck = require('./validator_check').valid;
var invalidCheck = require('./validator_check').invalid;

var valids = [ 0, '0', 10, 1.23 ];
var invalids = [ 'foo', -10, true, {}, function () {}, [], NaN ];

describe('min 0 validator', function() {

    var min = validator.min(0);

    valids.forEach(function (val) {
        validCheck(min, val);
    });

    invalids.forEach(function (val) {
        invalidCheck(min, val);
    });
});

describe('minimum 0 validator', function() {

    var minimum = validator.minimum(0);

    valids.forEach(function (val) {
        validCheck(minimum, val);
    });

    invalids.forEach(function (val) {
        invalidCheck(minimum, val);
    });
});
