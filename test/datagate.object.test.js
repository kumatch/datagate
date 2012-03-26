var datagate = require('../');

describe('Datagate object', function() {

    describe('空の object datagate を作成', function() {
        var gate;

        before(function (done) {
            gate = datagate.object({});
            done();
        });

        it('gate は関数', function(done) {
            (typeof gate).should.equal('function');
            done();
        });

        it('非 Object を通すとエラーを得る', function (done) {
            var value = 123;

            gate(value, function (err, output) {
                err.should.throw;
                done();
            });
        });

        it('{foo:123, bar:456} を通すと空オブジェクトを得る', function (done) {
            var value = {
                foo: 123,
                bar: 456
            };

            gate(value, function (err, output) {
                (!err).should.ok;

                output.should.not.have.property('foo');
                output.should.not.have.property('bar');

                done();
            });
        });
    });



    describe('foo に toLowerCase, bar に replace(/a/gi, "o") を行う object datagate を作成', function() {
        var gate;
        var filter = datagate.filter;

        before(function (done) {
            gate = datagate.object({
                foo: datagate([
                    filter.toLowerCase
                ]),
                bar: datagate([
                    filter.replace(/a/gi, 'o')
                ])
            });
            done();
        });

        it('{foo:FOO, bar:BAR, baz:BAZ} を与えると {foo:foo, bar:BOR} を得る', function (done) {
            var value = {
                foo: 'FOO',
                bar: 'BAR',
                baz: 'BAZ'
            };

            gate(value, function (err, output) {
                (!err).should.ok;

                output.foo.should.equal('foo');
                output.bar.should.equal('BoR');
                output.should.not.have.property('baz');

                done();
            });
        });
    });

    describe('foo に iSAlphabet, bar に isInteger を行う object datagate を作成', function() {
        var gate;
        var validator = datagate.validator;
        var foo_message = 'foo error';
        var bar_message = 'bar error';

        before(function (done) {
            gate = datagate.object({
                foo: datagate([
                    [validator.isAlphabet, foo_message]
                ]),
                bar: datagate([
                    validator.isInteger
                ], bar_message)
            });
            done();
        });

        it('{foo:foo, bar:123, baz:baz} を与えると {foo:foo, bar:123} を得る', function (done) {
            var value = {
                foo: 'foo',
                bar: 123,
                baz: 'baz'
            };

            gate(value, function (err, output) {
                (!err).should.ok;

                output.foo.should.equal('foo');
                output.bar.should.equal(123);
                output.should.not.have.property('baz');

                done();
            });
        });

        it('{foo:foo, bar:bar, baz:baz} を与えると {foo:foo, bar:bar} と共に bar に対するエラーを得る', function (done) {
            var value = {
                foo: 'foo',
                bar: 'bar',
                baz: 'baz'
            };

            gate(value, function (err, output) {
                output.foo.should.equal(value.foo);
                output.bar.should.equal(value.bar);
                output.should.not.have.property('baz');

                err.bar.should.throw;
                err.bar.name.should.equal('DatagateVariableError');
                err.bar.message.should.equal(bar_message);
                err.bar.origin.should.equal(value.bar);
                err.bar.result.should.equal(value.bar);

                err.should.not.have.property('foo');
                err.should.not.have.property('baz');

                done();
            });
        });


        it('{foo:123, bar:456, baz:789} を与えると {foo:123, bar:456} と共に foo に対するエラーを得る', function (done) {
            var value = {
                foo: 123,
                bar: 456,
                baz: 789
            };

            gate(value, function (err, output) {
                output.foo.should.equal(value.foo);
                output.bar.should.equal(value.bar);
                output.should.not.have.property('baz');

                err.foo.should.throw;
                err.foo.name.should.equal('DatagateVariableError');
                err.foo.message.should.equal(foo_message);
                err.foo.origin.should.equal(value.foo);
                err.foo.result.should.equal(value.foo);

                err.should.not.have.property('bar');
                err.should.not.have.property('baz');

                done();
            });
        });
    });


    describe('one string, some integers, child object datagate', function() {
        var gate;
        var filter = datagate.filter;
        var validator = datagate.validator;

        var string_message = 'string message';
        var integers_message = 'integers message';
        var child_string_message = 'child string message';
        var child_integers_message = 'child integers message';

        before(function (done) {
            gate = datagate.object({
                string: datagate([
                    filter.toLowerCase,
                    validator.isAlphabet
                ], string_message),

                integers: datagate.array([
                    [validator.isInteger, integers_message]
                ]),

                child: datagate.object({
                    string: datagate([
                        filter.toLowerCase,
                        [validator.isAlphabet, child_string_message]
                    ]),

                    integers: datagate.array([
                        validator.isInteger
                    ], child_integers_message)
                })
            });


            done();
        });

        it('valid なデータを与えると filter 結果後の値を得る', function (done) {

            var value = {
                string: 'FOO',
                integers: [10, 20, 30],
                child: {
                    string: 'BAR',
                    integers: [40, 50]
                }
            };

            gate(value, function (err, output) {
                (!err).should.ok;

                output.string.should.equal('foo');
                output.integers.length.should.equal(3);
                output.integers[0].should.equal(10);
                output.integers[1].should.equal(20);
                output.integers[2].should.equal(30);
                output.child.string.should.equal('bar');
                output.child.integers.length.should.equal(2);
                output.child.integers[0].should.equal(40);
                output.child.integers[1].should.equal(50);

                done();
            });
        });


        it('invalid なデータを与えると filter 結果後の値およびエラーを得る', function (done) {

            var value = {
                string: 123,
                integers: ['foo', 'bar', 456],
                child: {
                    string: 789,
                    integers: 'baz'
                }
            };

            gate(value, function (err, output) {

                output.string.should.equal('123');
                output.integers.length.should.equal(3);
                output.integers[0].should.equal('foo');
                output.integers[1].should.equal('bar');
                output.integers[2].should.equal(456);
                output.child.string.should.equal('789');
                output.child.integers.should.equal('baz');

                err.string.should.throw;
                err.string.name.should.equal('DatagateVariableError');
                err.string.message.should.equal(string_message);
                err.string.origin.should.equal(123);
                err.string.result.should.equal('123');

                err.integers.should.throw;
                err.integers.name.should.equal('DatagateVariableError');
                err.integers.message.length.should.equal(2);
                err.integers.message[0].should.equal(integers_message);
                err.integers.message[0].should.equal(integers_message);
                err.integers.origin[0].should.equal('foo');
                err.integers.origin[1].should.equal('bar');
                err.integers.origin[2].should.equal(456);
                err.integers.result[0].should.equal('foo');
                err.integers.result[1].should.equal('bar');
                err.integers.result[2].should.equal(456);

                err.child.string.should.throw;
                err.child.string.name.should.equal('DatagateVariableError');
                err.child.string.message.should.equal(child_string_message);
                err.child.string.origin.should.equal(789);
                err.child.string.result.should.equal('789');

                err.child.integers.should.throw;
                err.child.integers.name.should.equal('DatagateVariableError');
                err.child.integers.message.should.not.equal(child_integers_message);
                err.child.integers.origin.should.equal('baz');
                err.child.integers.result.should.equal('baz');

                done();
            });
        });
    });
});