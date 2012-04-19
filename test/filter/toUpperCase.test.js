var filter = require('../../src/filter');
var filterCheck = require('./filter_check');

describe('toUpperCase filter', function() {

    var values = [
        { title: 'foobar => FOOBAR',     from: 'foobar', to: 'FOOBAR' },
        { title: 'FOOBAR => FOOBAR',     from: 'FOOBAR', to: 'FOOBAR' },
        { title: 'FOO1BAR2 => FOO1BAR2', from: 'foo1BAR2', to: 'FOO1BAR2' },
        { title: '123 => 123',           from: 123, to: 123 },
        { title: 'true => true',             from: true, to: true },
        { title: 'false => false',           from: false, to: false },
        { title: '"" => ""',                 from: '', to: '' },
        { title: 'null => null',             from: null, to: null },
        { title: 'undefined => undefined',   from: undefined, to: undefined }
    ];

    var toUpperCase = filter.toUpperCase;

    values.forEach(function (value) {
        filterCheck(toUpperCase, value.title, value.from, value.to);
    });
});
