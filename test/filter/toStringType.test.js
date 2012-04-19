var filter = require('../../src/filter');
var filterCheck = require('./filter_check');

describe('toStringType filter', function() {

    var values = [
        { title: 'fooBar => fooBar',          from: 'fooBar', to: 'fooBar' },
        { title: '123 => "123"',              from: 123, to: '123' },
        { title: '0xa => "10"',               from: 0xa, to: '10' },
        { title: 'true => "true"',            from: true, to: 'true' },
        { title: 'false => "false"',          from: false, to: 'false' },
        { title: '"" => ""',                  from: '', to: '' },
        { title: 'null => "null"',            from: null, to: 'null' },
        { title: 'undefined => "undefined"',  from: undefined, to: 'undefined' }
    ];

    var toStringType = filter.toStringType;

    values.forEach(function (value) {
        filterCheck(toStringType, value.title, value.from, value.to);
    });
});
