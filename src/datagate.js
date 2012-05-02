(function () {
    var root = this;
    var _ = root._ || require('underscore');
    var async = root.async || require('async');
    var datagate = createNewGate;

    if (typeof module !== 'undefined' && module.exports) {
        exports = module.exports = datagate;
    } else {
        root.datagate = datagate;
    }

    datagate.__DATAGATE__ = true;

    function createNewGate(entries, root_error_message) {
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

                        next(new datagate.VariableError({
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



    datagate.array = function createNewArrayGate(gate, error_message) {
        if (error_message === undefined) {
            error_message = 'Invalid value in array.';
        }

        return function (values, callback) {
            var results = [];
            var errors = [];

            if (!_.isArray(values)) {
                callback(new datagate.ArrayError({
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
                    var total_err = new datagate.ArrayError({
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



    datagate.object = function createNewObjectGate(entries, error_message) {
        if (error_message === undefined) {
            error_message = 'Invalid object value.';
        }

        var properties = entries ? _.keys(entries) : [];

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
                        var total_err = new datagate.ObjectError({
                            message: error_message,
                            origin: object,
                            result: results,
                            properties: errors
                        });

                        callback(total_err, results);
                    } else {
                        callback(null, results);
                    }
                }
            });
        };
    };


    datagate.union = function createNewUnionGate(gates, error_message) {
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
                    var union_err = new datagate.UnionError({
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




    datagate.VariableError = DatagateVariableError;
    datagate.ArrayError    = DatagateArrayError;
    datagate.ObjectError   = DatagateObjectError;
    datagate.UnionError    = DatagateUnionError;


    function DatagateVariableError (params) {
        Error.call(this);
        Error.captureStackTrace(this, arguments.callee);

        this.name = 'DatagateVariableError';
        this.message = params.message;
        this.origin = params.origin;
        this.result = params.result;
    }

    function DatagateArrayError (params) {
        Error.call(this);
        Error.captureStackTrace(this, arguments.callee);

        this.name = 'DatagateArrayError';
        this.message = params.message;
        this.origin = params.origin;
        this.result = params.result;

        this.errors = params.errors;
        this.errors_message = _createArrayErrorsMessage(this.errors);
    }


    function DatagateObjectError (params) {
        Error.call(this);
        Error.captureStackTrace(this, arguments.callee);

        this.name = 'DatagateObjectError';
        this.message = params.message;
        this.origin = params.origin;
        this.result = params.result;

        this.properties = params.properties;
        this.properties_message = _createObjectPropertiesMessage(this.properties);
    }

    function DatagateUnionError (params) {
        Error.call(this);
        Error.captureStackTrace(this, arguments.callee);

        this.name = 'DatagateUnionError';
        this.message = params.message;
        this.origin = params.origin;
        this.result = params.result;

        this.errors = params.errors;
        this.errors_message = _createArrayErrorsMessage(this.errors);
    }



    function _createObjectPropertiesMessage(errors) {
        var keys = _.keys(errors);
        var c = keys.length;
        var message = {};

        for (var i = 0; i < c; i++) {
            var key = keys[i];
            var error = errors[key];

            if (error.name === 'DatagateObjectError') {
                message[key] = error.properties_message;
            } else if (error.name === 'DatagateArrayError') {
                message[key] = error.errors_message;
            } else {
                message[key] = error.message;
            }
        }

        return message;
    }

    function _createArrayErrorsMessage(errors) {

        return _.map(errors, function (error) {
            if (error.name === 'DatagateObjectError') {
                return error.properties_message;
            } else if (error.name === 'DatagateArrayError' || error.name === 'DatagateUnionError') {
                return error.errors_message;
            } else {
                return error.message;
            }
        });
    }

    DatagateVariableError.prototype = new Error();
    DatagateArrayError.prototype    = new Error();
    DatagateObjectError.prototype   = new Error();
    DatagateUnionError.prototype    = new Error();

}).call(this);