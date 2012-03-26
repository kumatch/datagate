var datagate = require('../');

describe('Datagate', function() {

    it('filter オブジェクトがある', function () {
        (typeof datagate.filter).should.equal('object');
    });

    it('validator オブジェクトがある', function () {
        (typeof datagate.validator).should.equal('object');
    });





    describe('空の datagate を作成', function() {
        var gate;

        before(function (done) {
            gate = datagate([]);
            done();
        });

        it('gate は関数', function(done) {
            (typeof gate).should.equal('function');
            done();
        });

        it('値を通すと同じ値を得る', function (done) {
            var value = 123;

            gate(value, function (err, output) {
                (!err).should.ok;
                output.should.equal(value);
                done();
            });
        });
    });

    describe('3 つの filter をもった datagate を作成', function() {
        var gate;
        var filter = datagate.filter;

        before(function (done) {
            gate = datagate([
                filter.trim,
                filter.toLowerCase,
                filter.replace(/o/g, 'a')
            ]);
            done();
        });

        it('値を通すと設定内容に適した結果を得る', function (done) {
            var value = "  FOOBAR  \t\n";
            var result = 'faabar';

            gate(value, function (err, output) {
                (!err).should.ok;
                output.should.equal(result);
                done();
            });
        });
    });

    describe('toLowerCase filter と isAlphabet validator をもった datagate を作成', function() {
        var gate;
        var filter = datagate.filter;
        var validator = datagate.validator;

        before(function (done) {
            gate = datagate([
                filter.toLowerCase,
                validator.isAlphabet
            ]);
            done();
        });

        it('FOO => foo, BAR => bar へと連続で成功する', function (done) {
            gate('FOO', function (err, output) {
                (!err).should.ok;
                output.should.equal('foo');

                gate('BAR', function (err, output) {
                    (!err).should.ok;
                    output.should.equal('bar');
                    done();
                });
            });
        });

        it('FOO1 => foo1 になるもののエラーを得る', function (done) {
            gate('FOO1', function (err, output) {
                output.should.equal('foo1');

                err.should.throw;
                err.name.should.equal('DatagateVariableError');
                err.message.should.equal('Invalid value / origin: FOO1, result: foo1');
                err.origin.should.equal('FOO1');
                err.result.should.equal('foo1');

                done();
            });
        });
    });


    describe('isAlphabet datagate を作成し、トップレベル文字列エラーメッセージを準備', function() {
        var gate;
        var validator = datagate.validator;
        var message = 'not alphabet.';

        gate = datagate([
            validator.isAlphabet
        ], message);

        DatagateMessageValidTest(gate);
        DatagateMessageInvalidTest(gate, message);
    });


    describe('isAlphabet datagate を作成し、トップレベル関数エラーメッセージを準備', function() {
        var gate;
        var validator = datagate.validator;
        var message = function (origin, result) {
            return origin + ',' + result;
        };

        gate = datagate([
            validator.isAlphabet
        ], message);

        DatagateMessageValidTest(gate);
        DatagateMessageInvalidTest(gate, message);
    });


    describe('isAlphabet datagate を作成し、フィルタ単位の文字列エラーメッセージを準備', function() {
        var gate;
        var validator = datagate.validator;
        var message = 'not alphabet.';

        gate = datagate([
            [validator.isAlphabet, message]
        ]);

        DatagateMessageValidTest(gate);
        DatagateMessageInvalidTest(gate, message);
    });


    describe('isAlphabet datagate を作成し、フィルタ単位の関数エラーメッセージを準備', function() {
        var gate;
        var validator = datagate.validator;
        var message = function (origin, result) {
            return origin + ',' + result;
        };

        gate = datagate([
            [validator.isAlphabet, message]
        ]);

        DatagateMessageValidTest(gate);
        DatagateMessageInvalidTest(gate, message);
    });

    describe('isAlphabet datagate を作成し、トップレベル、フィルタ単位双方のエラーメッセージを準備するとフィルタ側が優先される', function() {
        var gate;
        var validator = datagate.validator;
        var top_message = 'top error message';
        var filter_message = 'filter error message';

        gate = datagate([
            [validator.isAlphabet, filter_message]
        ], top_message);

        DatagateMessageValidTest(gate);
        DatagateMessageInvalidTest(gate, filter_message);
    });


    describe('isAlphabet, isInteger datagate を作成し、フィルタ単位のエラーメッセージを準備', function() {
        var gate;
        var validator = datagate.validator;
        var alphabet_message = 'isAlphabet error.';
        var integer_message = 'isInteger error.';

        before(function (done) {
            gate = datagate([
                [validator.isAlphabet, alphabet_message],
                [validator.isInteger,  integer_message]
            ]);
            done();
        });

        it('foo を与えると foo と共に isInteger 用メッセージを持つエラーを得る', function (done) {
            var value = 'foo';
            gate(value, function (err, output) {
                output.should.equal(value);

                err.should.throw;
                err.name.should.equal('DatagateVariableError');
                err.message.should.equal(integer_message);
                done();
            });
        });

        it('123 を与えると 123 と共に isAlphabet 用メッセージを持つエラーを得る', function (done) {
            var value = 123;
            gate(value, function (err, output) {
                output.should.equal(value);

                err.should.throw;
                err.name.should.equal('DatagateVariableError');
                err.message.should.equal(alphabet_message);
                done();
            });
        });
    });
});


function DatagateMessageValidTest(gate) {

    it('foo を与えると foo を得ると共にエラーは発生しない', function (done) {
        var value = 'foo';

        gate(value, function (err, output) {
            (!err).should.ok;

            output.should.equal(value);
            done();
        });
    });
}


function DatagateMessageInvalidTest(gate, message) {

    it('123 を与えると 123 と共に設定したメッセージを持つエラーを得る', function (done) {
        var value = 123;
        var result_message;

        if (typeof message === 'function') {
            result_message = message(value, value);
        } else {
            result_message = message;
        }


        gate(value, function (err, output) {
            err.should.throw;
            err.name.should.equal('DatagateVariableError');
            err.message.should.equal(result_message);
            err.origin.should.equal(value);
            err.result.should.equal(value);

            output.should.equal(value);
            done();
        });
    });
}