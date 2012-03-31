var validator = require('../../lib/validator');
var validCheck = require('./validator_check').valid;
var invalidCheck = require('./validator_check').invalid;

var valids = [ new Date() ];
var invalids = [ 'date', new Date().toString(), 1, function () {}, {foo: 1}, [10, 20], true, NaN, null, undefined ];

describe('isDateType validator', function() {

    var isDateType = validator.isDateType;

    valids.forEach(function (val) {
        validCheck(isDateType, val);
    });

    invalids.forEach(function (val) {
        invalidCheck(isDateType, val);
    });
});


describe('notDateType validator', function() {

    var notDateType = validator.notDateType;

    invalids.forEach(function (val) {
        validCheck(notDateType, val);
    });

    valids.forEach(function (val) {
        invalidCheck(notDateType, val);
    });
});
