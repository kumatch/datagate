var validator = require('../../src/validator');
var validCheck = require('./validator_check').valid;
var invalidCheck = require('./validator_check').invalid;

var valids = [ true, false ];
var invalids = [ 'foo', 'true', 1, { bar: 123 }, function () {}, [10, 20], NaN, '', null, undefined ];

describe('isBooleanType validator', function() {

    var isBooleanType = validator.isBooleanType;

    valids.forEach(function (val) {
        validCheck(isBooleanType, val);
    });

    invalids.forEach(function (val) {
        invalidCheck(isBooleanType, val);
    });
});


describe('notBooleanType validator', function() {

    var notBooleanType = validator.notBooleanType;

    invalids.forEach(function (val) {
        validCheck(notBooleanType, val);
    });

    valids.forEach(function (val) {
        invalidCheck(notBooleanType, val);
    });
});
