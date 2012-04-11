"use strict";

var _ = require('underscore');
var async = require('async');

var datagate = require('./');
var DatagateError = require('./error').ObjectError;

exports = module.exports = function (entries, error_message) {

    if (error_message === undefined) {
        error_message = 'Invalid object value.';
    }

    var properties = entries ? Object.keys(entries) : [];

    return function (object, callback) {

        var results = {};
        var errors = {};
        var has_error = false;

        if (!_.isObject(object)) {
            has_error = true;
        }

        async.forEach(properties, function (property, next) {
            var gate = entries[property];
            var value = object ? object[property] : undefined;

            gate(value, function (err, result) {
                results[property] = result;

                if (err) {
                    errors[property] = err;
                    has_error = true;
                }

                next();
            });
        }, function (err) {
            if (err) {
                callback(err);
            } else {
                if (has_error) {
                    var total_err = new DatagateError({
                        message: error_message,
                        origin: object,
                        result: results,
                        errors: errors
                    });

                    callback(total_err, results);
                } else {
                    callback(null, results);
                }
            }
        });
    };
};