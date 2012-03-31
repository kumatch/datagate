"use strict";

var _ = require('underscore');
var async = require('async');

var datagate = require('./');
var UnionError = require('./error').UnionError;

exports = module.exports = function (gates, error_message) {

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
                var union_err = new UnionError({
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