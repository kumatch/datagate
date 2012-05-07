var utils = require('./utils');
var ArrayError = require('./error').ArrayError;

var _ = utils._;
var plow = utils.plow;

module.exports = function createNewArrayGate(gate, error_message) {
    if (error_message === undefined) {
        error_message = 'Invalid value in array.';
    }

    return function (values, callback) {
        var errors = [];
        var results = [];

        if (!_.isArray(values)) {
            callback(new ArrayError({
                message: error_message,
                origin: values,
                result: [],
                errors: errors
            }), []);

            return;
        }

        plow.map(values, function (value, index, next) {
            if (typeof gate === 'function') {
                gate(value, function (err, result) {
                    if (err) {
                        errors[index] = err;
                    }
                    results[index] = result;
                    next(null);
                });
            } else {
                results[index] = value;
                next();
            }
        }, function (err) {
            if (err) {
                callback(err);
                return;
            }

            errors = _.compact(errors);

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
