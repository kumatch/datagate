var utils = require('./utils');
var ArrayError = require('./error').ArrayError;

var _ = utils._;
var async = utils.async;

module.exports = function createNewArrayGate(gate, error_message) {
    if (error_message === undefined) {
        error_message = 'Invalid value in array.';
    }

    return function (values, callback) {
        var results = [];
        var errors = [];

        if (!_.isArray(values)) {
            callback(new ArrayError({
                message: error_message,
                origin: values,
                result: results,
                errors: errors
            }), results);
            return;
        }


        async.forEachSeries(values, function (value, next) {
            if (typeof gate === 'function') {
                gate(value, function (err, result) {
                    results.push(result);
                    if (err) {
                        errors.push(err);
                    }
                    next();
                });
            } else {
                results.push(value);
                next();
            }
        }, function (err) {
            if (errors.length) {
                var total_err = new ArrayError({
                    message: error_message,
                    origin: values,
                    result: results,
                    errors: errors
                });

                callback(total_err, results);
            } else {
                callback(null, results);
            }
        });

    };
};
