var validator = require('../../src/validator');
var validCheck = require('./validator_check').valid;
var invalidCheck = require('./validator_check').invalid;

var valids = [ null ];
var invalids = [ 'null', 0, true, {}, function () {}, [], NaN, '', undefined ];

describe('isNull validator', function() {

    var isNull = validator.isNull;

    valids.forEach(function (val) {
        validCheck(isNull, val);
    });

    invalids.forEach(function (val) {
        invalidCheck(isNull, val);
    });
});

describe('notNull validator', function() {

    var notNull = validator.notNull;

    valids.forEach(function (val) {
        invalidCheck(notNull, val);
    });

    invalids.forEach(function (val) {
        validCheck(notNull, val);
    });
});
