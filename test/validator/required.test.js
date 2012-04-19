var validator = require('../../src/validator');
var validCheck = require('./validator_check').valid;
var invalidCheck = require('./validator_check').invalid;

describe('required validator', function() {

    var required = validator.required;
    var valids = [ 'foo', 0, '', null, {}, [] ];
    var invalids = [ undefined ];

    valids.forEach(function (val) {
        validCheck(required, val);
    });

    invalids.forEach(function (val) {
        invalidCheck(required, val);
    });
});
