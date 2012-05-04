var filter = require('../../lib/filter');
var filterCheck = require('./filter_check');

describe('toBooleanType filter', function() {

    var values = [
        { title: 'foo => true',          from: 'foo', to: true },
        { title: '123 => true',          from: 123, to: true },
        { title: '"0a" => true',         from: '0a', to: true },
        { title: '"0" => false',         from: '0', to: false },
        { title: '0 => false',           from: 0, to: false },
        { title: 'true => true',         from: true, to: true },
        { title: 'false => false',       from: false, to: false },
        { title: '"" => false',          from: '', to: false },
        { title: 'null => false',        from: null, to: false },
        { title: 'undefined => false',   from: undefined, to: false }
    ];

    var toBooleanType = filter.toBooleanType;

    values.forEach(function (value) {
        filterCheck(toBooleanType, value.title, value.from, value.to);
    });
});
