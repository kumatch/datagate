var validator = require('../../src/validator');
var validCheck = require('./validator_check').valid;
var invalidCheck = require('./validator_check').invalid;

var valids = [ function() {}  ];
var invalids = [ 'function', 1, { bar: 123 }, [10, 20], true, NaN, '', null, undefined ];

describe('isFunctionType validator', function() {

    var isFunctionType = validator.isFunctionType;

    valids.forEach(function (val) {
        validCheck(isFunctionType, val);
    });

    invalids.forEach(function (val) {
        invalidCheck(isFunctionType, val);
    });
});


describe('notFunctionType validator', function() {

    var notFunctionType = validator.notFunctionType;

    invalids.forEach(function (val) {
        validCheck(notFunctionType, val);
    });

    valids.forEach(function (val) {
        invalidCheck(notFunctionType, val);
    });
});
