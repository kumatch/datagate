var validator = require('../lib/validator');

function validCheck (func, value) {
    it(value + ' => valid', function(done) {
        func(value, function (err, result) {
            (!err).should.ok;
            result.should.equal(value);
            done();
        });
    });
}

function invalidCheck (func, value) {
    it(value + ' => invalid', function(done) {
        func(value, function (err, result) {
            err.should.throw();
            (!result).should.ok;
            done();
        });
    });
}


describe('Datagate validator', function() {

    describe('notEmpty', function() {
        var notEmpty = validator.notEmpty;
        var valids = [ 'foo', 0 ];
        var invalids = [ '', null, undefined ];

        valids.forEach(function (val) {
            validCheck(notEmpty, val);
        });

        invalids.forEach(function (val) {
            invalidCheck(notEmpty, val);
        });
    });

    describe('isInteger', function() {
        var isInteger = validator.isInteger;
        var valids = [ 10, 0, -12345 ];
        var invalids = [ 1.23, -4.5 ];

        valids.forEach(function (val) {
            validCheck(isInteger, val);
        });

        invalids.forEach(function (val) {
            invalidCheck(isInteger, val);
        });
    });

    describe('isAlphabet', function() {
        var isAlphabet = validator.isAlphabet;
        var valids = [ 'foo', 'BAR' ];
        var invalids = [ 123, 'foo1', 'foo_bar' ];

        valids.forEach(function (val) {
            validCheck(isAlphabet, val);
        });

        invalids.forEach(function (val) {
            invalidCheck(isAlphabet, val);
        });
    });
});
