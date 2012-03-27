var datagate = require('../');

describe('Datagate object', function() {

    describe('空の object datagate を作成', function() {
        var gate;

        before(function (done) {
            gate = datagate.object();
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

                err.should.throw;
                err.name.should.equal('DatagateObjectError');
                err.message.should.equal('Invalid object value.');
                err.origin.should.equal(value);
                err.result.should.equal(output);

                err.errors.bar.name.should.equal('DatagateVariableError');
                err.errors.bar.message.should.equal(bar_message);
                err.errors.bar.origin.should.equal(value.bar);
                err.errors.bar.result.should.equal(value.bar);

                err.errors.should.not.have.property('foo');
                err.errors.should.not.have.property('baz');

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

                err.should.throw;
                err.name.should.equal('DatagateObjectError');
                err.message.should.equal('Invalid object value.');
                err.origin.should.equal(value);
                err.result.should.equal(output);

                err.errors.foo.name.should.equal('DatagateVariableError');
                err.errors.foo.message.should.equal(foo_message);
                err.errors.foo.origin.should.equal(value.foo);
                err.errors.foo.result.should.equal(value.foo);

                err.should.not.have.property('bar');
                err.should.not.have.property('baz');

                done();
            });
        });
    });


    describe('child object datagate', function() {
        var gate;
        var filter = datagate.filter;
        var validator = datagate.validator;

        var object_message = 'object message';
        var child_object_message = 'child object message';
        var array_message = 'array message';
        var string_message = 'string message';
        var integers_message = 'integers message';

        before(function (done) {
            gate = datagate.object({
                child: datagate.object({
                    string: datagate([
                        filter.toLowerCase,
                        [validator.isAlphabet, string_message]
                    ]),

                    integers: datagate.array(
                        datagate([
                            validator.isInteger
                        ], integers_message), array_message
                    )
                }, child_object_message)
            }, object_message);

            done();
        });

        it('valid なデータを与えると filter 結果後の値を得る', function (done) {

            var value = {
                child: {
                    string: 'FOO',
                    integers: [123, 456]
                }
            };

            gate(value, function (err, output) {
                (!err).should.ok;

                output.child.string.should.equal('foo');
                output.child.integers.length.should.equal(2);
                output.child.integers[0].should.equal(123);
                output.child.integers[1].should.equal(456);

                done();
            });
        });


        it('invalid なデータを与えると filter 結果後の値およびエラーを得る', function (done) {

            var value = {
                child: {
                    string: 12345,
                    integers: ['bar', 'baz']
                }
            };

            gate(value, function (err, output) {
                output.child.string.should.equal('12345');
                output.child.integers[0].should.equal('bar');
                output.child.integers[1].should.equal('baz');

                err.should.throw;
                err.name.should.equal('DatagateObjectError');
                err.message.should.equal(object_message);
                err.origin.should.equal(value);
                err.result.should.equal(output);

                err.errors.child.name.should.equal('DatagateObjectError');
                err.errors.child.message.should.equal(child_object_message);
                err.errors.child.origin.should.equal(value.child);
                err.errors.child.result.should.equal(output.child);

                err.errors.child.errors.string.name.should.equal('DatagateVariableError');
                err.errors.child.errors.string.message.should.equal(string_message);
                err.errors.child.errors.string.origin.should.equal(12345);
                err.errors.child.errors.string.result.should.equal('12345');

                err.errors.child.errors.integers.name.should.equal('DatagateArrayError');
                err.errors.child.errors.integers.message.should.equal(array_message);
                err.errors.child.errors.integers.origin[0].should.equal('bar');
                err.errors.child.errors.integers.origin[1].should.equal('baz');
                err.errors.child.errors.integers.result[0].should.equal('bar');
                err.errors.child.errors.integers.result[1].should.equal('baz');

                done();
            });
        });
    });
});