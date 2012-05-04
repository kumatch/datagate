var filter = require('../../lib/filter');
var filterCheck = require('./filter_check');

describe('replace filter', function() {

    var values = [
        { title: 'foofoo => barbar', from: 'foofoo', to: 'barbar' },
        { title: '123 => 123',           from: 123, to: 123 },
        { title: 'true => true',         from: true, to: true },
        { title: 'false => false',       from: false, to: false },
        { title: '"" => ""',                 from: '', to: '' },
        { title: 'null => null',             from: null, to: null },
        { title: 'undefined => undefined',   from: undefined, to: undefined }
    ];

    var replace = filter.replace(/foo/g, 'bar');

    values.forEach(function (value) {
        filterCheck(replace, value.title, value.from, value.to);
    });
});