"use strict";

var _ = require('underscore');
var async = require('async');

var datagate = require('./');
var DatagateError = require('./error');

exports = module.exports = function (entries) {

    var properties = Object.keys(entries);

    return function (object, callback) {
        if (!_.isObject(object)) {
            callback(new DatagateError({
                message: 'Invalid object value',
                origin: object,
                result: object
            }));
            return;
        }


        var results = {};
        var errors = {};
        var has_error = false;

        async.forEach(properties, function (property, next) {
            var gate = entries[property];

            gate(object[property], function (err, result) {
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
                    callback(errors, results);
                } else {
                    callback(null, results);
                }
            }
        });
    };




    // var args = Array.prototype.slice.apply(arguments);
    // var gate = datagate.apply(datagate, args);

    // return function (values, callback) {
    //     if (!_.isArray(values)) {
    //         callback(new DatagateError({
    //             message: 'Invalid array value',
    //             origin: values,
    //             result: values
    //         }));
    //         return;
    //     }

    //     var results = [];
    //     var errors = [];

    //     async.forEachSeries(values, function (value, next) {
    //         gate(value, function (err, result) {
    //             results.push(result);
    //             if (err) {
    //                 errors.push(err);
    //             }
    //             next();
    //         });
    //     }, function (err) {
    //         if (errors.length) {
    //             callback(errors, results);
    //         } else {
    //             callback(null, results);
    //         }
    //     });

    // };
};