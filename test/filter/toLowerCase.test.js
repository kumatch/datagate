var filter = require('../../src/filter');
var filterCheck = require('./filter_check');

describe('toLowerCase filter', function() {

    var values = [
        { title: 'foobar => foobar',     from: 'foobar', to: 'foobar' },
        { title: 'FOOBAR => foobar',     from: 'FOOBAR', to: 'foobar' },
        { title: 'foo1BAR2 => foo1bar2', from: 'foo1BAR2', to: 'foo1bar2' },
        { title: '123 => 123',           from: 123, to: 123 },
        { title: 'true => true',             from: true, to: true },
        { title: 'false => false',           from: false, to: false },
        { title: '"" => ""',                 from: '', to: '' },
        { title: 'null => null',             from: null, to: null },
        { title: 'undefined => undefined',   from: undefined, to: undefined }
    ];

    var toLowerCase = filter.toLowerCase;

    values.forEach(function (value) {
        filterCheck(toLowerCase, value.title, value.from, value.to);
    });
});
