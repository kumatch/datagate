var filter = require('../../src/filter');
var filterCheck = require('./filter_check');

describe('trim filter', function() {

    var values = [
        { title: 'foo => foo',                       from: 'foo', to: 'foo' },
        { title: '\\x20foo\\t => foo',               from: "\x20foo\t", to: 'foo' },
        { title: '\\n\\nfoo\\t\\x20\\t\\x20 => foo', from: "\n\nfoo\t\x20\t\x20", to: 'foo' },
        { title: '\\n => ""',                        from: "\n", to: '' },
        { title: '123 => 123',                       from: 123, to: 123 },
        { title: 'true => true',                     from: true, to: true },
        { title: 'false => false',                   from: false, to: false },
        { title: '"" => ""',                         from: '', to: '' },
        { title: 'null => null',                     from: null, to: null },
        { title: 'undefined => undefined',           from: undefined, to: undefined }
    ];

    var trim = filter.trim;

    values.forEach(function (value) {
        filterCheck(trim, value.title, value.from, value.to);
    });
});