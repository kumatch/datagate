var validator = require('../../lib/validator');
var validCheck = require('./validator_check').valid;
var invalidCheck = require('./validator_check').invalid;

var valids = [ '00:00:00', '23:59:59' ];
var invalids = [ '00:00:aa', '00:bb:00', 'cc:00:00', '24:00:00', '00:60:00', '00:00:60', 'foo', 10, -20, 3.4, { bar: 123 }, function () {}, [10, 20], true, '', null, undefined, NaN ];

describe('isTime validator', function() {

    var isTime = validator.isTime;

    valids.forEach(function (val) {
        validCheck(isTime, val);
    });

    invalids.forEach(function (val) {
        invalidCheck(isTime, val);
    });
});


describe('notTime validator', function() {

    var notTime = validator.notTime;

    invalids.forEach(function (val) {
        validCheck(notTime, val);
    });

    valids.forEach(function (val) {
        invalidCheck(notTime, val);
    });
});
