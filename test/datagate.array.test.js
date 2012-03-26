var datagate = require('../');

describe('Datagate array', function() {

    describe('空の array datagate を作成', function() {
        var gate;

        before(function (done) {
            gate = datagate.array([]);
            done();
        });

        it('gate は関数', function(done) {
            (typeof gate).should.equal('function');
            done();
        });

        it('非 Array を通すとエラーを得る', function (done) {
            var value = 123;

            gate(value, function (err, output) {
                output.should.equal(value);
                err.should.throw;
                done();
            });
        });

        it('[1, 2, 3] を通すと同じ値を得る', function (done) {
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
            gate = datagate.array([
                filter.toLowerCase,
                filter.replace(/o/g, 'a')
            ]);
            done();
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
            gate = datagate.array([
                filter.toLowerCase,
                validator.isAlphabet
            ]);
            done();
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
                err.name.should.equal('DatagateVariableError');
                err.message.length.should.equal(1);
                err.message[0].should.equal('Invalid value / origin: Bar1, result: bar1');

                err.origin.length.should.equal(3);
                err.origin[0].should.equal('FOO');
                err.origin[1].should.equal('Bar1');
                err.origin[2].should.equal('baz');

                err.result.length.should.equal(3);
                err.result[0].should.equal('foo');
                err.result[1].should.equal('bar1');
                err.result[2].should.equal('baz');

                done();
            });
        });
    });


    describe('isAlphabet array datagate を作成し、トップレベル文字列エラーメッセージを準備', function() {
        var gate;
        var validator = datagate.validator;
        var message = 'not alphabet.';

        gate = datagate.array([
            validator.isAlphabet
        ], message);

        DatagateArrayMessageValidTest(gate);
        DatagateArrayMessageInvalidTest(gate, message);
    });


    describe('isAlphabet array datagate を作成し、トップレベル関数エラーメッセージを準備', function() {
        var gate;
        var validator = datagate.validator;
        var message = function (origin, result) {
            return origin + ',' + result;
        };

        gate = datagate.array([
            validator.isAlphabet
        ], message);

        DatagateArrayMessageValidTest(gate);
        DatagateArrayMessageInvalidTest(gate, message);
    });


    describe('isAlphabet array datagate を作成し、フィルタ単位の文字列エラーメッセージを準備', function() {
        var gate;
        var validator = datagate.validator;
        var message = 'not alphabet.';

        gate = datagate.array([
            [validator.isAlphabet, message]
        ]);

        DatagateArrayMessageValidTest(gate);
        DatagateArrayMessageInvalidTest(gate, message);
    });


    describe('isAlphabet array datagate を作成し、フィルタ単位の関数エラーメッセージを準備', function() {
        var gate;
        var validator = datagate.validator;
        var message = function (origin, result) {
            return origin + ',' + result;
        };

        gate = datagate.array([
            [validator.isAlphabet, message]
        ]);

        DatagateArrayMessageValidTest(gate);
        DatagateArrayMessageInvalidTest(gate, message);
    });

    describe('isAlphabet array datagate を作成し、トップレベル、フィルタ単位双方のエラーメッセージを準備するとフィルタ側が優先される', function() {
        var gate;
        var validator = datagate.validator;
        var top_message = 'top error message';
        var filter_message = 'filter error message';

        gate = datagate.array([
            [validator.isAlphabet, filter_message]
        ], top_message);

        DatagateArrayMessageValidTest(gate);
        DatagateArrayMessageInvalidTest(gate, filter_message);
    });


    describe('isAlphabet, isInteger array datagate を作成し、フィルタ単位のエラーメッセージを準備', function() {
        var gate;
        var validator = datagate.validator;
        var alphabet_message = 'isAlphabet error.';
        var integer_message = 'isInteger error.';

        before(function (done) {
            gate = datagate.array([
                [validator.isAlphabet, alphabet_message],
                [validator.isInteger,  integer_message]
            ]);
            done();
        });

        it('[foo] を与えると isInteger 用メッセージを持つエラーを得る', function (done) {
            var value = ['foo'];

            gate(value, function (err, output) {
                err.should.throw;
                err.name.should.equal('DatagateVariableError');

                err.message[0].should.equal(integer_message);
                err.origin[0].should.equal(value[0]);
                err.result[0].should.equal(value[0]);
                done();
            });
        });

        it('[123] を与えると isAlphabet 用メッセージを持つエラーを得る', function (done) {
            var value = [123];

            gate(value, function (err, output) {
                err.should.throw;
                err.name.should.equal('DatagateVariableError');

                err.message[0].should.equal(alphabet_message);
                err.origin[0].should.equal(value[0]);
                err.result[0].should.equal(value[0]);
                done();
            });
        });

        it('[foo, 123] を与えるとそれぞれのメッセージを持つエラーを得る', function (done) {
            var value = ['foo', 123];

            gate(value, function (err, output) {
                err.should.throw;
                err.name.should.equal('DatagateVariableError');

                err.message[0].should.equal(integer_message);
                err.message[1].should.equal(alphabet_message);

                err.origin[0].should.equal(value[0]);
                err.origin[1].should.equal(value[1]);
                err.result[0].should.equal(value[0]);
                err.result[1].should.equal(value[1]);

                done();
            });
        });
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
        var result_message1, result_message2;

        if (typeof message === 'function') {
            result_message1 = message(value[0], value[0]);
            result_message2 = message(value[1], value[1]);
        } else {
            result_message1 = result_message2 = message;
        }


        gate(value, function (err, output) {
            output.length.should.equal(2);
            output[0].should.equal(value[0]);
            output[1].should.equal(value[1]);

            err.should.throw;
            err.name.should.equal('DatagateVariableError');

            err.message.length.should.equal(2);
            err.message[0].should.equal(result_message1);
            err.message[1].should.equal(result_message2);

            err.origin.length.should.equal(2);
            err.origin[0].should.equal(value[0]);
            err.origin[1].should.equal(value[1]);

            err.result.length.should.equal(2);
            err.result[0].should.equal(value[0]);
            err.result[1].should.equal(value[1]);

            done();
        });
    });
}