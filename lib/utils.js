if (typeof _ !== 'undefined' && _.VERSION) {
    exports._ = _;
} else {
    exports._ = require('underscore');
}

exports.plow = require('./plow');