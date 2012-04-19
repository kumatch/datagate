var validator = require('../../src/validator');
var validCheck = require('./validator_check').valid;
var invalidCheck = require('./validator_check').invalid;

var valids = [ {foo: 123}, {}, new (function() {})() ];
var invalids = [ 'object', 1, function () {}, new Date(), [10, 20], true, NaN, null, undefined ];

describe('isObjectType validator', function() {

    var isObjectType = validator.isObjectType;

    valids.forEach(function (val) {
        validCheck(isObjectType, val);
    });

    invalids.forEach(function (val) {
        invalidCheck(isObjectType, val);
    });
});


describe('notObjectType validator', function() {

    var notObjectType = validator.notObjectType;

    invalids.forEach(function (val) {
        validCheck(notObjectType, val);
    });

    valids.forEach(function (val) {
        invalidCheck(notObjectType, val);
    });
});
