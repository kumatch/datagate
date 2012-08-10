var datagate = require('../');
var _ = require('underscore');

describe('Datagate array', function() {

    describe('空の array datagate を作成', function() {
        var gate;

        before(function (done) {
            gate = datagate.array();
            done();
        });

        it('gate は関数', function(done) {
            (typeof gate).should.equal('function');
            done();
        });

        it('非 Array を通すとエラーが発生して空 Array を得る', function (done) {
            var value = 123;

            gate(value, function (err, output) {
                err.should.throw;
                _.isArray(output).should.ok;
                output.length.should.equal(0);

                done();
            });
        });

        it('空 Array を通すとエラーは発生せずに空 Array を得る', function (done) {
            var value = [];

            gate(value, function (err, output) {
                (err === null).should.ok;
                _.isArray(output).should.ok;
                output.length.should.equal(0);

                done();
            });
        });

        it('[1, 2, 3] を通すとエラーは発生せずに [1, 2, 3] を得る', function (done) {
            var value = [1, 2, 3];

            gate(value, function (err, output) {
                (!err).should.ok;

                output.length.should.equal(3);
                output[0].should.equal(value[0]);
                output[1].should.equal(value[1]);
                output[2].should.equal(value[2]);

                done();
            });
        });
    });

    describe('toLowerCase, replace(/o/g, "a") filter をもった array datagate を作成', function() {
        var gate;
        var filter = datagate.filter;

        before(function (done) {
            gate = datagate.array(
                datagate([
                    filter.toLowerCase,
                    filter.replace(/o/g, 'a')
                ])
            );
            done();
        });

        it('非 Array を通すとエラーが発生して空 Array を得る', function (done) {
            var value = 123;

            gate(value, function (err, output) {
                err.should.throw;
                _.isArray(output).should.ok;
                output.length.should.equal(0);

                done();
            });
        });

        it('空 Array を通すとエラーは発生せずに空 Array を得る', function (done) {
            var value = [];

            gate(value, function (err, output) {
                (err === null).should.ok;
                _.isArray(output).should.ok;
                output.length.should.equal(0);

                done();
            });
        });

        it('["FOO", "Bar", "baz"] を与えると ["faa", "bar", "baz"] を得る', function (done) {
            var value = ['FOO', 'Bar', 'baz'];

            gate(value, function (err, output) {
                (!err).should.ok;

                output.length.should.equal(3);
                output[0].should.equal('faa');
                output[1].should.equal('bar');
                output[2].should.equal('baz');

                done();
            });
        });
    });


    describe('toLowerCase filter と isAlphabet validator をもった array datagate を作成', function() {
        var gate;
        var filter = datagate.filter;
        var validator = datagate.validator;

        before(function (done) {
            gate = datagate.array(
                datagate([
                    filter.toLowerCase,
                    validator.isAlphabet
                ])
            );
            done();
        });

        it('非 Array を通すとエラーが発生して空 Array を得る', function (done) {
            var value = 123;

            gate(value, function (err, output) {
                err.should.throw;
                _.isArray(output).should.ok;
                output.length.should.equal(0);

                done();
            });
        });

        it('空 Array を通すとエラーは発生せずに空 Array を得る', function (done) {
            var value = [];

            gate(value, function (err, output) {
                (err === null).should.ok;
                _.isArray(output).should.ok;
                output.length.should.equal(0);

                done();
            });
        });

        it('["FOO", "Bar", "baz"] を与えると ["foo", "bar", "baz"] を得る', function (done) {
            var value = ['FOO', 'Bar', 'baz'];

            gate(value, function (err, output) {
                (!err).should.ok;

                output.length.should.equal(3);
                output[0].should.equal('foo');
                output[1].should.equal('bar');
                output[2].should.equal('baz');

                done();
            });
        });

        it('["FOO", "Bar1", "baz"] を与えると ["foo", "bar1", "baz"] と共に Bar1 に対してのエラーを得る', function (done) {
            var value = ['FOO', 'Bar1', 'baz'];

            gate(value, function (err, output) {
                output.length.should.equal(3);
                output[0].should.equal('foo');
                output[1].should.equal('bar1');
                output[2].should.equal('baz');

                err.should.throw;
                err.name.should.equal('DatagateArrayError');
                err.message.should.equal('Invalid value in array.');

                err.origin.length.should.equal(3);
                err.origin[0].should.equal('FOO');
                err.origin[1].should.equal('Bar1');
                err.origin[2].should.equal('baz');

                err.result.length.should.equal(3);
                err.result[0].should.equal('foo');
                err.result[1].should.equal('bar1');
                err.result[2].should.equal('baz');

                err.errors.length.should.equal(1);
                err.errors[0].message.should.equal('Invalid value / origin: Bar1, result: bar1');
                err.errors[0].origin.should.equal('Bar1');
                err.errors[0].result.should.equal('bar1');

                done();
            });
        });
    });


    describe('array のための array datagate を作成', function() {
        var gate;
        var filter = datagate.filter;
        var validator = datagate.validator;

        before(function (done) {
            gate = datagate.array(
                datagate.array(
                    datagate([
                        filter.toLowerCase,
                        validator.isAlphabet
                    ])
                )
            );
            done();
        });

        it('[ ["FOO", "bar"], ["BAZ"] ] を与えると [ ["foo", "bar"], ["baz"] ] を得る', function (done) {
            var value = [
                ["FOO", "bar"],
                ["BAZ"]
            ];

            gate(value, function (err, output) {
                (!err).should.ok;

                output.length.should.equal(2);

                output[0].length.should.equal(2);
                output[0][0].should.equal('foo');
                output[0][1].should.equal('bar');

                output[1].length.should.equal(1);
                output[1][0].should.equal('baz');

                done();
            });
        });

        it('[ ["FOO", 123], "BAZ" ] を与えると [ ["foo", 123], [] ] と共にエラーを得る', function (done) {
            var value = [
                ["FOO", 123],
                "BAZ"
            ];

            gate(value, function (err, output) {
                output.length.should.equal(2);

                output[0].length.should.equal(2);
                output[0][0].should.equal('foo');
                output[0][1].should.equal(123);

                _.isArray(output[1]).should.ok;
                output[1].length.should.equal(0);

                err.should.throw;
                err.name.should.equal('DatagateArrayError');
                err.message.should.equal('Invalid value in array.');

                err.origin.length.should.equal(2);
                err.origin[0][0].should.equal('FOO');
                err.origin[0][1].should.equal(123);
                err.origin[1].should.equal('BAZ');

                err.result.length.should.equal(2);
                err.result[0][0].should.equal('foo');
                err.result[0][1].should.equal(123);

                _.isArray(err.result[1]).should.ok;
                err.result[1].length.should.equal(0);

                err.errors.length.should.equal(2);
                err.errors[0].name.should.equal('DatagateArrayError');
                err.errors[0].message.should.equal('Invalid value in array.');
                err.errors[0].origin.length.should.equal(2);
                err.errors[0].origin[0].should.equal('FOO');
                err.errors[0].origin[1].should.equal(123);
                err.errors[0].result.length.should.equal(2);
                err.errors[0].result[0].should.equal('foo');
                err.errors[0].result[1].should.equal(123);

                err.errors[0].errors.length.should.equal(1);
                err.errors[0].errors[0].name.should.equal('DatagateVariableError');
                err.errors[0].errors[0].message.should.equal('Invalid value / origin: 123, result: 123');
                err.errors[0].errors[0].origin.should.equal(123);
                err.errors[0].errors[0].result.should.equal(123);


                err.errors[1].name.should.equal('DatagateArrayError');
                err.errors[1].message.should.equal('Invalid value in array.');
                err.errors[1].origin.should.equal('BAZ');
                _.isArray(err.errors[1].result).should.ok;
                err.errors[1].result.length.should.equal(0);

                done();
            });
        });
    });


    describe('isAlphabet array datagate を作成し、文字列エラーメッセージを準備', function() {
        var gate;
        var validator = datagate.validator;
        var message = 'not alphabet.';

        gate = datagate.array(
            datagate([
                validator.isAlphabet
            ]), message
        );

        DatagateArrayMessageValidTest(gate);
        DatagateArrayMessageInvalidTest(gate, message);
    });


    describe('isAlphabet array datagate を作成し、関数エラーメッセージを準備', function() {
        var gate;
        var validator = datagate.validator;
        var message = function (origin, result) {
            return origin + ',' + result;
        };

        gate = datagate.array(
            datagate([
                validator.isAlphabet
            ]), message
        );

        DatagateArrayMessageValidTest(gate);
        DatagateArrayMessageInvalidTest(gate, message);
    });
});

function DatagateArrayMessageValidTest(gate) {

    it('[foo, bar] を与えると [foo, bar] を得ると共にエラーは発生しない', function (done) {
        var value = ['foo', 'bar'];

        gate(value, function (err, output) {
            output.length.should.equal(2);
            output[0].should.equal(value[0]);
            output[1].should.equal(value[1]);

            (!err).should.ok;

            done();
        });
    });
}


function DatagateArrayMessageInvalidTest(gate, message) {

    it('[123, 456] を与えると [123, 456] と共に設定したメッセージを持つエラーを得る', function (done) {
        var value = [123, 456];
        var result_message;

        if (typeof message === 'function') {
            result_message = message(value, value);
        } else {
            result_message = message;
        }

        gate(value, function (err, output) {
            output.length.should.equal(2);
            output[0].should.equal(value[0]);
            output[1].should.equal(value[1]);

            err.name.should.equal('DatagateArrayError');
            err.message.should.equal(result_message);

            err.origin.length.should.equal(2);
            err.origin[0].should.equal(value[0]);
            err.origin[1].should.equal(value[1]);

            err.result.length.should.equal(2);
            err.result[0].should.equal(value[0]);
            err.result[1].should.equal(value[1]);

            err.errors.length.should.equal(2);
            err.errors[0].origin.should.equal(value[0]);
            err.errors[1].origin.should.equal(value[1]);
            err.errors[0].result.should.equal(value[0]);
            err.errors[1].result.should.equal(value[1]);

            done();
        });
    });
}