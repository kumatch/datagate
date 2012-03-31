var filter = require('../../lib/filter');
var filterCheck = require('./filter_check');

describe('custom filter (to true if over 10, and false else)', function() {

    var values = [
        { title: '10 => true',   from : 10, to: true },
        { title: '9 => false',   from : 9,  to: false },
        { title: 'foo => false', from : 'foo',  to: false }
    ];

    var custome = filter.custom(function (val, callback) {
        if (typeof val === 'number' && val >= 10) {
            callback(null, true);
        } else {
            callback(null, false);
        }
    });

    values.forEach(function (value) {
        filterCheck(custome, value.title, value.from, value.to);
    });
});