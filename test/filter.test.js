var filter = require('../lib/filter');

function filterCheck(func, title, from, to) {
    it(title, function(done) {
        func(from, function (err, result) {
            (!err).should.ok;
            result.should.equal(to);
            done();
        });
    });
}


describe('Datagate filter', function() {

    describe('trim', function() {
        var trim = filter.trim;
        var values = [
            { title: '"" => ""',                         from: '', to: '' },
            { title: 'foo => foo',                       from: 'foo', to: 'foo' },
            { title: '\\x20foo\\t => foo',               from: "\x20foo\t", to: 'foo' },
            { title: '\\n\\nfoo\\t\\x20\\t\\x20 => foo', from: "\n\nfoo\t\x20\t\x20", to: 'foo' },
            { title: '\\n => ""',                        from: "\n", to: '' }
        ];

        values.forEach(function (value) {
            filterCheck(trim, value.title, value.from, value.to);
        });
    });


    describe('toLowerCase', function() {
        var toLowerCase = filter.toLowerCase;
        var values = [
            { title: '"" => ""',             from: '', to: '' },
            { title: 'foobar => foobar',     from: 'foobar', to: 'foobar' },
            { title: 'FOOBAR => foobar',     from: 'FOOBAR', to: 'foobar' },
            { title: 'foo1BAR2 => foo1bar2', from: 'foo1BAR2', to: 'foo1bar2' }
        ];

        values.forEach(function (value) {
            filterCheck(toLowerCase, value.title, value.from, value.to);
        });
    });


    describe('replace /foo/g to bar', function() {
        var replace = filter.replace(/foo/g, 'bar');
        var values = [
            { title: '"" => ""',         from: '', to: '' },
            { title: 'foofoo => barbar', from: 'foofoo', to: 'barbar' }
        ];

        values.forEach(function (value) {
            filterCheck(replace, value.title, value.from, value.to);
        });
    });
});