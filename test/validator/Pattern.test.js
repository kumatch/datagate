var validator = require('../../lib/validator');
var validCheck = require('./validator_check').valid;
var invalidCheck = require('./validator_check').invalid;

var valids = [ 'abcdef', 123456789, '3664319cf98bc5351b09caada66c4f6f36bc3599' ];
var invalids = [ 'foo', 'ABC', 'A_B_C', false, {}, function () {}, [10, 20], NaN, '', null, undefined ];

var pattern = /^[a-f0-9]+$/;

describe('isPattern /^[a-f0-9]+$/ validator', function() {

    var isPattern = validator.isPattern(pattern);

    valids.forEach(function (val) {
        validCheck(isPattern, val);
    });

    invalids.forEach(function (val) {
        invalidCheck(isPattern, val);
    });
});

describe('notPattern (foo, 123, true]) validator', function() {

    var notPattern = validator.notPattern(pattern);
    console.log(notPattern);

    valids.forEach(function (val) {
        invalidCheck(notPattern, val);
    });

    invalids.forEach(function (val) {
        validCheck(notPattern, val);
    });
});
