var validator = require('../../src/validator');
var validCheck = require('./validator_check').valid;
var invalidCheck = require('./validator_check').invalid;

var valids = [ 'foo', '123', 123, 'foo123', 'foo_123', '!"#$%&\'()-=^~\\|@`[]{};:+*,./_<>?' ];
var invalids = [ true, {}, function () {}, [10, 20], NaN, '', null, undefined ];

describe('isAscii validator', function() {

    var isAscii = validator.isAscii;

    valids.forEach(function (val) {
        validCheck(isAscii, val);
    });

    invalids.forEach(function (val) {
        invalidCheck(isAscii, val);
    });
});

describe('notAscii validator', function() {

    var notAscii = validator.notAscii;

    valids.forEach(function (val) {
        invalidCheck(notAscii, val);
    });

    invalids.forEach(function (val) {
        validCheck(notAscii, val);
    });
});
