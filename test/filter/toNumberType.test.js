var filter = require('../../lib/filter');
var filterCheck = require('./filter_check');

describe('toNumberType filter', function() {

    var values = [
        { title: '123 => 123',          from: 123, to: 123 },
        { title: '"123" => 123',        from: '123', to: 123 },
        { title: '"12.34" => 12.34',    from: '12.34', to: 12.34 },
        { title: '-123 => -123',        from: -123, to: -123 },
        { title: '"-123" => -123',      from: '-123', to: -123 },
        { title: '"-12.34" => -12.34',  from: '-12.34', to: -12.34 },
        { title: '0xA => 10',           from: 0xA, to: 10 },
        { title: '"0xA" => 10',         from: '0xA', to: 10 },
        { title: 'A => NaN',            from: 'A', to: NaN },
        { title: '123A => NaN',         from: '123A', to: NaN },
        { title: 'true => 1',         from: true, to: 1 },
        { title: 'false => 0',        from: false, to: 0 },
        { title: '"" => NaN',           from: '', to: NaN },
        { title: 'null => NaN',         from: null, to: NaN },
        { title: 'undefined => NaN',    from: undefined, to: NaN }
    ];

    var toNumberType = filter.toNumberType;

    values.forEach(function (value) {
        filterCheck(toNumberType, value.title, value.from, value.to);
    });
});
