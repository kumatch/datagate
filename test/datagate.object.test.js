var datagate = require('../');
var _ = require('underscore');

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

        it('非オブジェクトを通すとエラーが発生して空オブジェクトを得る', function (done) {
            var value = 123;

            gate(value, function (err, output) {
                err.should.throw;
                _.isObject(output).should.ok;
                _.isEmpty(output).should.ok;

                done();
            });
        });

        it('空オブジェクトを通すとエラーは発生せずに空オブジェクトを得る', function (done) {
            var value = {};

            gate(value, function (err, output) {
                (err === null).should.ok;
                _.isObject(output).should.ok;
                _.isEmpty(output).should.ok;
                done();
            });
        });

        it('{foo:123, bar:456} を通すとエラーは発生せずに空オブジェクトを得る', function (done) {
            var value = {
                foo: 123,
                bar: 456
            };

            gate(value, function (err, output) {
                (err === null).should.ok;
                _.isObject(output).should.ok;
                _.isEmpty(output).should.ok;
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

        it('非オブジェクトを与えるとエラーが発生して {foo: undefined, bar: undefined} を得る', function (done) {
            var value = 123;

            gate(value, function (err, output) {
                err.should.throw;

                output.should.ownProperty('foo');
                output.should.ownProperty('bar');

                (output.foo === undefined).should.ok;
                (output.bar === undefined).should.ok;

                done();
            });
        });

        it('空オブジェクトを与えるとエラーは発生せず {foo: undefined, bar: undefined} を得る', function (done) {
            var value = {};

            gate(value, function (err, output) {
                (err === null).should.ok;

                output.should.ownProperty('foo');
                output.should.ownProperty('bar');

                (output.foo === undefined).should.ok;
                (output.bar === undefined).should.ok;

                done();
            });
        });


        it('{foo:FOO, bar:BAR, baz:BAZ} を与えるとエラーは発生せず {foo:foo, bar:BOR} を得る', function (done) {
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

        it('非オブジェクトを与えるとエラーが発生して {foo: undefined, bar: undefined} を得る', function (done) {
            var value = 123;

            gate(value, function (err, output) {
                err.should.throw;

                output.should.ownProperty('foo');
                output.should.ownProperty('bar');

                (output.foo === undefined).should.ok;
                (output.bar === undefined).should.ok;

                err.properties.foo.should.throw;
                err.properties.bar.should.throw;

                err.properties_message.should.ownProperty('foo');
                err.properties_message.should.ownProperty('bar');

                done();
            });
        });

        it('空オブジェクトを与えるとエラーが発生して {foo: undefined, bar: undefined} を得る', function (done) {
            var value = {};

            gate(value, function (err, output) {
                err.should.throw;

                output.should.ownProperty('foo');
                output.should.ownProperty('bar');

                (output.foo === undefined).should.ok;
                (output.bar === undefined).should.ok;

                err.properties.foo.should.throw;
                err.properties.bar.should.throw;

                err.properties_message.should.ownProperty('foo');
                err.properties_message.should.ownProperty('bar');

                done();
            });
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

                err.properties.bar.name.should.equal('DatagateVariableError');
                err.properties.bar.message.should.equal(bar_message);
                err.properties.bar.origin.should.equal(value.bar);
                err.properties.bar.result.should.equal(value.bar);

                err.properties.should.not.have.property('foo');
                err.properties.should.not.have.property('baz');

                err.properties_message.should.ownProperty('bar');
                err.properties_message.should.not.have.property('foo');
                err.properties_message.should.not.have.property('baz');

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

                err.properties.foo.name.should.equal('DatagateVariableError');
                err.properties.foo.message.should.equal(foo_message);
                err.properties.foo.origin.should.equal(value.foo);
                err.properties.foo.result.should.equal(value.foo);

                err.properties.should.not.have.property('bar');
                err.properties.should.not.have.property('baz');

                err.properties_message.should.ownProperty('foo');
                err.properties_message.should.not.have.property('bar');
                err.properties_message.should.not.have.property('baz');

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
                output.child.string.should.equal(12345);
                output.child.integers[0].should.equal('bar');
                output.child.integers[1].should.equal('baz');

                err.should.throw;
                err.name.should.equal('DatagateObjectError');
                err.message.should.equal(object_message);
                err.origin.should.equal(value);
                err.result.should.equal(output);

                err.properties.child.name.should.equal('DatagateObjectError');
                err.properties.child.message.should.equal(child_object_message);
                err.properties.child.origin.should.equal(value.child);
                err.properties.child.result.should.equal(output.child);

                err.properties.child.properties.string.name.should.equal('DatagateVariableError');
                err.properties.child.properties.string.message.should.equal(string_message);
                err.properties.child.properties.string.origin.should.equal(12345);
                err.properties.child.properties.string.result.should.equal(12345);

                err.properties.child.properties.integers.name.should.equal('DatagateArrayError');
                err.properties.child.properties.integers.message.should.equal(array_message);
                err.properties.child.properties.integers.origin[0].should.equal('bar');
                err.properties.child.properties.integers.origin[1].should.equal('baz');
                err.properties.child.properties.integers.result[0].should.equal('bar');
                err.properties.child.properties.integers.result[1].should.equal('baz');

                err.properties_message.should.ownProperty('child');
                err.properties_message.child.string.should.equal(string_message);
                err.properties_message.child.integers.length.should.equal(2);
                err.properties_message.child.integers[0].should.equal(integers_message);
                err.properties_message.child.integers[1].should.equal(integers_message);

                done();
            });
        });
    });
});