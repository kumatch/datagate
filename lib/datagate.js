var utils = require('./utils');
var VariableError = require('./error').VariableError;

var _ = utils._;
var async = utils.async;

exports = module.exports = datagate;

exports.array   = require('./array');
exports.object  = require('./object');
exports.union   = require('./union');

exports.filter    = require('./filter');
exports.validator = require('./validator');


function datagate(entries, root_error_message) {
    if (root_error_message === undefined) {
        root_error_message = function (origin, result) {
            return 'Invalid value / origin: ' + origin + ', result: ' + result;
        };
    }

    var filters = _.map(entries, function (entry) {
        var func, error_message;

            if (_.isArray(entry)) {
                func = entry[0];
                error_message = entry[1] || root_error_message;
            } else {
                func = entry;
                error_message = root_error_message;
            }

        if (!_.isFunction(func)) {
            throw Error('Invalid datagate filter.');
        }

        return function (origin, val, next) {
            func(val, function (err, result) {
                if (!err) {
                    next(null, origin, result);
                } else {
                    var message = error_message;

                    if (_.isFunction(error_message)) {
                        message = error_message(origin, val);
                    }

                    next(new VariableError({
                        message: message,
                        origin: origin,
                        result: val
                    }));
                }
            });
        };
    });

    return function (value, callback) {

        var tasks = filters.slice(0);
        tasks.unshift(function (next) {
            next(null, value, value);
        });

        async.waterfall(tasks, function (err, origin, result) {
            if (!err) {
                callback(null, result);
            } else {
                callback(err, err.result);
            }
        });
    };
}
