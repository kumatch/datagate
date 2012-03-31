var format = require('util').format;
var inspect = require('util').inspect;

var object_types = {
  '[object Object]'  : 'object',
  '[object Number]'  : 'number',
  '[object String]'  : 'string',
  '[object Boolean]' : 'boolean',
  '[object Array]'   : 'array',
  '[object Function]': 'function',
  '[object Date]'    : 'date',
  '[object RegExp]'  : 'regexp'
};

function type(value) {
    var t = Object.prototype.toString.call(value);
    if (object_types[t]) {
        return object_types[t]
    } else {
        return t;
    }
}

exports.valid = function validCheck (func, value) {
    it(format('%s (%s) => valid', inspect(value), type(value)), function(done) {
        func(value, function (err, result) {
            (!err).should.ok;

            if (isNaN(result)) {
                isNaN(value).should.ok;
                isNaN(result).should.ok;
            } else {
                (result === value).should.ok;
            }

            done();
        });
    });
};

exports.invalid = function invalidCheck (func, value) {
    it(format('%s (%s) => invalid',inspect(value), type(value)), function(done) {
        func(value, function (err, result) {
            err.should.throw();
            (!result).should.ok;
            done();
        });
    });
};
