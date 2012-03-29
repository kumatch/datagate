var filter = require('../../lib/filter');
var filterCheck = require('./filter_check');

describe('toDefault filter (default is "OK")', function() {

    var values = [
        { title: 'foo => foo',          from: 'foo', to: 'foo' },
        { title: '123 => 123',          from: 123, to: 123 },
        { title: '"0" => "0"',         from: '0', to: '0' },
        { title: '0 => 0',           from: 0, to: 0 },
        { title: 'true => true',           from: true, to: true },
        { title: 'false => false',           from: false, to: false },
        { title: '"" => OK',          from: '', to: 'OK' },
        { title: 'null => OK',        from: null, to: 'OK' },
        { title: 'undefined => OK',   from: undefined, to: 'OK' }
    ];

    var toDefault = filter.toDefault('OK');

    values.forEach(function (value) {
        filterCheck(toDefault, value.title, value.from, value.to);
    });
});
