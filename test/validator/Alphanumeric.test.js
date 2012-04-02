var validator = require('../../lib/validator');
var validCheck = require('./validator_check').valid;
var invalidCheck = require('./validator_check').invalid;

var valids = [ 'foo', 'BAR', 123, '456', 'foo123' ];
var invalids = [ 'foo_bar', '123 456', -789, 3.14, true, {}, function () {}, [10, 20], NaN, '', null, undefined ];

describe('isAlphanumeric validator', function() {

    var isAlphanumeric = validator.isAlphanumeric;

    valids.forEach(function (val) {
        validCheck(isAlphanumeric, val);
    });

    invalids.forEach(function (val) {
        invalidCheck(isAlphanumeric, val);
    });
});

describe('notAlphanumeric validator', function() {

    var notAlphanumeric = validator.notAlphanumeric;

    valids.forEach(function (val) {
        invalidCheck(notAlphanumeric, val);
    });

    invalids.forEach(function (val) {
        validCheck(notAlphanumeric, val);
    });
});
