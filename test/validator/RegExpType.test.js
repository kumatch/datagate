var validator = require('../../src/validator');
var validCheck = require('./validator_check').valid;
var invalidCheck = require('./validator_check').invalid;

var valids = [ /foo/, new RegExp('bar') ];
var invalids = [ 'RegExp', 1, function () {}, {foo: 1}, [10, 20], true, NaN, null, undefined ];

describe('isRegExpType validator', function() {

    var isRegExpType = validator.isRegExpType;

    valids.forEach(function (val) {
        validCheck(isRegExpType, val);
    });

    invalids.forEach(function (val) {
        invalidCheck(isRegExpType, val);
    });
});


describe('notRegExpType validator', function() {

    var notRegExpType = validator.notRegExpType;

    invalids.forEach(function (val) {
        validCheck(notRegExpType, val);
    });

    valids.forEach(function (val) {
        invalidCheck(notRegExpType, val);
    });
});
