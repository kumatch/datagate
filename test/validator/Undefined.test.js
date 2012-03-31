var validator = require('../../lib/validator');
var validCheck = require('./validator_check').valid;
var invalidCheck = require('./validator_check').invalid;

var valids = [ undefined ];
var invalids = [ 'undefined', 0, true, {}, function () {}, [], NaN, '', null ];

describe('isUndefined validator', function() {

    var isUndefined = validator.isUndefined;

    valids.forEach(function (val) {
        validCheck(isUndefined, val);
    });

    invalids.forEach(function (val) {
        invalidCheck(isUndefined, val);
    });
});

describe('notUndefined validator', function() {

    var notUndefined = validator.notUndefined;

    valids.forEach(function (val) {
        invalidCheck(notUndefined, val);
    });

    invalids.forEach(function (val) {
        validCheck(notUndefined, val);
    });
});
