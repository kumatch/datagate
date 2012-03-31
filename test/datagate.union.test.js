var datagate = require('../');

describe('Datagate union', function() {

    describe('空の union datagate を作成', function() {
        var gate;

        before(function (done) {
            gate = datagate.union();
            done();
        });

        it('gate は関数', function(done) {
            (typeof gate).should.equal('function');
            done();
        });

        it('123 を通すと同じ値を得る', function (done) {
            var value = 123;

            gate(value, function (err, output) {
                (!err).should.ok;
                output.should.equal(value);
                done();
            });
        });
    });

    describe('toLowerCase filter gate と toUpperCase filter gate をもった union datagate を作成', function() {
        var gate;
        var filter = datagate.filter;

        before(function (done) {
            gate = datagate.union([
                datagate([
                    filter.toLowerCase
                ]),
                datagate([
                    filter.toUpperCase
                ])
            ]);
            done();
        });

        it('foo を与えると foo を得る', function (done) {
            var value = 'foo';

            gate(value, function (err, output) {
                (!err).should.ok;
                output.should.equal('foo');
                done();
            });
        });

        it('FOO を与えると foo を得る', function (done) {
            var value = 'FOO';

            gate(value, function (err, output) {
                (!err).should.ok;
                output.should.equal('foo');
                done();
            });
        });
    });

    describe('isNumberType validator gate と isStringType validator gate をもった union datagate を作成', function() {
        var gate;
        var validator = datagate.validator;
        var union_message = 'union error';
        var number_message = 'number error';
        var string_message = 'union error';

        before(function (done) {
            gate = datagate.union([
                datagate([
                    [validator.isNumberType, number_message]
                ]),
                datagate([
                    validator.isStringType
                ], string_message)
            ], union_message);
            done();
        });

        it('123 を与えると 123 を得る', function (done) {
            var value = 123;

            gate(value, function (err, output) {
                (!err).should.ok;
                output.should.equal(123);
                done();
            });
        });

        it('foo を与えると foo を得る', function (done) {
            var value = 'foo';

            gate(value, function (err, output) {
                (!err).should.ok;
                output.should.equal('foo');
                done();
            });
        });

        it('{ foo: 1 } を与えると { foo: 1 } と共にエラーを得る', function (done) {
            var value = { foo: 1 };

            gate(value, function (err, output) {
                output.should.equal(value);

                err.should.throw;
                err.name.should.equal('DatagateUnionError');
                err.message.should.equal(union_message);

                err.origin.should.equal(value);
                err.result.should.equal(value);

                err.errors.length.should.equal(2);
                err.errors[0].name.should.equal('DatagateVariableError');
                err.errors[0].message.should.equal(number_message);
                err.errors[0].origin.should.equal(value);
                err.errors[0].result.should.equal(value);

                err.errors[1].name.should.equal('DatagateVariableError');
                err.errors[1].message.should.equal(string_message);
                err.errors[1].origin.should.equal(value);
                err.errors[1].result.should.equal(value);

                done();
            });
        });
    });
});


