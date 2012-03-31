var validator = require('../../lib/validator');
var validCheck = require('./validator_check').valid;
var invalidCheck = require('./validator_check').invalid;

var valids = [ 'foo', 'BAR' ];
var invalids = [ 123, 'foo1', 'foo_bar', true, {}, function () {}, [10, 20], NaN, '', null, undefined ];

describe('isAlphabet validator', function() {

    var isAlphabet = validator.isAlphabet;

    valids.forEach(function (val) {
        validCheck(isAlphabet, val);
    });

    invalids.forEach(function (val) {
        invalidCheck(isAlphabet, val);
    });
});

describe('notAlphabet validator', function() {

    var notAlphabet = validator.notAlphabet;

    valids.forEach(function (val) {
        invalidCheck(notAlphabet, val);
    });

    invalids.forEach(function (val) {
        validCheck(notAlphabet, val);
    });
});
