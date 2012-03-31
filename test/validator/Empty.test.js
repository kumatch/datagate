var validator = require('../../lib/validator');
var validCheck = require('./validator_check').valid;
var invalidCheck = require('./validator_check').invalid;

var valids = [ '', null, undefined ];
var invalids = [ 'foo', 0, true, {}, function () {}, [], NaN ];

describe('isEmpty validator', function() {

    var isEmpty = validator.isEmpty;

    valids.forEach(function (val) {
        validCheck(isEmpty, val);
    });

    invalids.forEach(function (val) {
        invalidCheck(isEmpty, val);
    });
});

describe('notEmpty validator', function() {

    var notEmpty = validator.notEmpty;

    valids.forEach(function (val) {
        invalidCheck(notEmpty, val);
    });

    invalids.forEach(function (val) {
        validCheck(notEmpty, val);
    });
});
