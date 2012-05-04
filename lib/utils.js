if (typeof _ !== 'undefined' && _.VERSION) {
    exports._ = _;
} else {
    exports._ = require('underscore');
}

if (typeof async !== 'undefined') {
    exports.async = async;
} else {
    exports.async = require('async');
}


exports.chain = function (acts, last) {
    next();

    function next(err) {
        if (err) {
            // acts.pop()(err);
            last(err);
        } else {
            var act = acts.shift();
            var args = Array.prototype.slice.call(arguments);

            if (acts.length > 0) {
                args = args.slice(1).concat(next);
            } else {
                args = args.slice(1).concat(last);
            }

            act.apply(null, args);
        }
    }
};
