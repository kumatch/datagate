"use strict";

var _ = require('underscore');
var async = require('async');

var datagate = require('./');
var DatagateError = require('./error').ArrayError;

exports = module.exports = function (gate, error_message) {

    if (error_message === undefined) {
        error_message = 'Invalid value in array.';
    }

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
        var errors = [];

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
                var total_err = new DatagateError({
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