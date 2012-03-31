var validator = require('../../lib/validator');
var validCheck = require('./validator_check').valid;
var invalidCheck = require('./validator_check').invalid;

var valids = [ [10, 20], ['foo', 'bar'], [ {foo: 1}, {bar: 2}] ];
var invalids = [ 'array', 1, function () {}, { foo: 1 }, new Date(), true, NaN, null, undefined ];

describe('isArrayType validator', function() {

    var isArrayType = validator.isArrayType;

    valids.forEach(function (val) {
        validCheck(isArrayType, val);
    });

    invalids.forEach(function (val) {
        invalidCheck(isArrayType, val);
    });
});


describe('notArrayType validator', function() {

    var notArrayType = validator.notArrayType;

    invalids.forEach(function (val) {
        validCheck(notArrayType, val);
    });

    valids.forEach(function (val) {
        invalidCheck(notArrayType, val);
    });
});
