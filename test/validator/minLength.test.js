var validator = require('../../src/validator');
var validCheck = require('./validator_check').valid;
var invalidCheck = require('./validator_check').invalid;

var valids = [ 'foooo', './foo.txt', 12345, 0.123, -1234 ];
var invalids = [ 'fooo', 1234, 0.12, -123, true, {}, function () {}, [], NaN ];

describe('minLength 5 validator', function() {

    var minLength = validator.minLength(5);

    valids.forEach(function (val) {
        validCheck(minLength, val);
    });

    invalids.forEach(function (val) {
        invalidCheck(minLength, val);
    });
});
