var validator = require('../../src/validator');
var validCheck = require('./validator_check').valid;
var invalidCheck = require('./validator_check').invalid;

var valids = [ NaN ];
var invalids = [ 'NaN', 10, -20, 3.4, { bar: 123 }, function () {}, [10, 20], true, '', null, undefined ];

describe('isNaNType validator', function() {

    var isNaN = validator.isNaN;

    valids.forEach(function (val) {
        validCheck(isNaN, val);
    });

    invalids.forEach(function (val) {
        invalidCheck(isNaN, val);
    });
});


describe('notNaN validator', function() {

    var notNaN = validator.notNaN;

    invalids.forEach(function (val) {
        validCheck(notNaN, val);
    });

    valids.forEach(function (val) {
        invalidCheck(notNaN, val);
    });
});
