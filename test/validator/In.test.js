var validator = require('../../lib/validator');
var validCheck = require('./validator_check').valid;
var invalidCheck = require('./validator_check').invalid;

var valids = [ 'foo', 123, true ];
var invalids = [ 'foo1', 'FOO', '123', 1234, false, {}, function () {}, [10, 20], NaN, '', null, undefined ];

describe('isIn [foo, 123, true ] validator', function() {

    var isIn = validator.isIn(['foo', 123, true ]);

    valids.forEach(function (val) {
        validCheck(isIn, val);
    });

    invalids.forEach(function (val) {
        invalidCheck(isIn, val);
    });
});

describe('notIn (foo, 123, true]) validator', function() {

    var notIn = validator.notIn(['foo', 123, true]);
    console.log(notIn);

    valids.forEach(function (val) {
        invalidCheck(notIn, val);
    });

    invalids.forEach(function (val) {
        validCheck(notIn, val);
    });
});
