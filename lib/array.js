"use strict";

var _ = require('underscore');
var async = require('async');

var datagate = require('./');
var DatagateError = require('./error');

exports = module.exports = function () {
    var args = Array.prototype.slice.apply(arguments);
    var gate = datagate.apply(datagate, args);

    return function (values, callback) {
        if (!_.isArray(values)) {
            callback(new DatagateError({
                message: 'Value must be array.',
                origin: values,
                result: values
            }), values);
            return;
        }

        var results = [];
        var error_messages = [];

        async.forEachSeries(values, function (value, next) {
            gate(value, function (err, result) {
                results.push(result);
                if (err) {
                    error_messages.push(err.message);
                }
                next();
            });
        }, function (err) {
            if (error_messages.length) {
                var total_err = new DatagateError({
                    message: error_messages,
                    origin: values,
                    result: results
                });

                callback(total_err, results);
            } else {
                callback(null, results);
            }
        });

    };
};