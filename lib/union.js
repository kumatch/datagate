var async = require('./utils').async;
var Error = require('./error');

module.exports = function createNewUnionGate(gates, error_message) {
    if (error_message === undefined) {
        error_message = 'Invalid value in union.';
    }

    return function (value, callback) {
        if (!gates) {
            return callback(null, value);
        }

        var errors = [];
        var last_result;

        async.forEachSeries(gates, function (gate, next) {
            gate(value, function (err, result) {
                last_result = result;

                if (err) {
                    errors.push(err);
                    next();
                } else {
                    callback(null, result);
                    }
            });
            }, function (err) {
                if (err) {
                    callback(err);
                } else {
                    var union_err = new Error.UnionError({
                        message: error_message,
                        origin: value,
                        result: last_result,
                        errors: errors
                    });

                    callback(union_err, last_result);
                }
            });
    };
};
