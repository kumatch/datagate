var validator = require('../../src/validator');
var validCheck = require('./validator_check').valid;
var invalidCheck = require('./validator_check').invalid;

var valids = [ 'foo@example.com', 'foo.bar+baz@mail.example.com' ];
var invalids = [ 'foo', 10, -20, 3.4, { bar: 123 }, function () {}, [10, 20], true, '', null, undefined, NaN ];

describe('isEmail validator', function() {

    var isEmail = validator.isEmail;

    valids.forEach(function (val) {
        validCheck(isEmail, val);
    });

    invalids.forEach(function (val) {
        invalidCheck(isEmail, val);
    });
});


describe('notEmail validator', function() {

    var notEmail = validator.notEmail;

    invalids.forEach(function (val) {
        validCheck(notEmail, val);
    });

    valids.forEach(function (val) {
        invalidCheck(notEmail, val);
    });
});
