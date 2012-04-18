var validator = require('../../lib/validator');
var validCheck = require('./validator_check').valid;
var invalidCheck = require('./validator_check').invalid;

var valids = [ '2012-01-01', '2013-02-31' ];
var invalids = [ '2012-01-a', '2013-1-1', '2014-01-32', 'foo', 10, -20, 3.4, { bar: 123 }, function () {}, [10, 20], true, '', null, undefined, NaN ];

describe('isDate validator', function() {

    var isDate = validator.isDate;

    valids.forEach(function (val) {
        validCheck(isDate, val);
    });

    invalids.forEach(function (val) {
        invalidCheck(isDate, val);
    });
});


describe('notDate validator', function() {

    var notDate = validator.notDate;

    invalids.forEach(function (val) {
        validCheck(notDate, val);
    });

    valids.forEach(function (val) {
        invalidCheck(notDate, val);
    });
});
