var validator = require('../../lib/validator');
var validCheck = require('./validator_check').valid;
var invalidCheck = require('./validator_check').invalid;

var valids = [ 'foo', './foo', 123, 4.567, -7777 ];
var invalids = [ 'foobar', 123456, 0.1234, -12345, true, {}, function () {}, [], NaN ];

describe('maxLength 5 validator', function() {

    var maxLength = validator.maxLength(5);

    valids.forEach(function (val) {
        validCheck(maxLength, val);
    });

    invalids.forEach(function (val) {
        invalidCheck(maxLength, val);
    });
});
