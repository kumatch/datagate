;(function (define) {
    define('datagate/plow', [], function () {
        var DEFAULT_CONCURRENCY = 10;

        function _sequential(list, end) {
            var tasks = Array.prototype.slice.call(list);

            end = end || function () {};

            if (!tasks.length) {
                end();
                return;
            }

            (function next(err) {
                if (err) {
                    end(err);
                } else {
                    var task = tasks.shift();
                    var args = Array.prototype.slice.call(arguments);

                    if (tasks.length > 0) {
                        args = args.slice(1).concat(next);
                    } else {
                        args = args.slice(1).concat(end);
                    }

                    _nextTick(function () {
                        try {
                            task.apply(null, args);
                            } catch (e) {
                                end(e);
                            }
                    });
                }
            })(null);
        }


        function _parallel(tasks, end) {
            var completed = 0;
            var failed = false;
            var is_array = _isArray(tasks);
            var results, length;

            if (is_array) {
                results = [];
                length = tasks.length;
            } else {
                results = {};
                length = _keys(tasks).length;
            }

            end = end || function () {};

            if (!length) {
                end(null, results);
                return;
            }


            var worker = function (task, index, next) {
                task(function (err, value) {
                    if (err) {
                        next(err);
                    } else {
                        next(null, {
                            index: index,
                            value: value
                        });
                    }
                });
            };

            var concurrency = 1;
                var index = 0;

            _doWork(concurrency, tasks, worker, index, function(err, result) {

                if (err) {
                    end(err);
                    return false;
                } else {
                    completed += 1;
                    results[result.index] = result.value;

                    if (completed === length) {
                        end(null, results);
                    }
                    return true;
                }
            });
        }


        function _map(list, worker, end) {
            var length = list.length;
            var results = [];
            var failed = false;

            end = end || function () {};

            if (!length) {
                end(null, []);
            } else {
                _doWork(DEFAULT_CONCURRENCY, list, worker, 0, function(err, result) {
                    if (err) {
                        end(err, results);
                        return false;
                    } else {
                        results.push(result);

                        if (results.length === length) {
                            end(null, results);
                        }
                        return true;
                    }
                });
            }
        }


        function _doWork(concurrency, list, worker, currentIndex, callback) {
            var failed = false;
            var is_array  = _isArray(list);
            var keys, length;

            if (is_array) {
                length = list.length;
            } else {
                keys = _keys(list);
                length = keys.length;
            }

            function workerCallback (err, result) {
                if (!callback(err, result)) {
                    failed = true;
                }
            }

            _nextTick(function () {
                for (var i = currentIndex; (i < length && i < (currentIndex + concurrency)); i++) {
                    if (!failed) {
                        try {
                            var value, index;

                            if (is_array) {
                                index = i;
                                value = list[index];
                            } else {
                                index = keys[i];
                                value = list[index];
                            }

                            if (worker.length > 2) {
                                worker(value, index, workerCallback);
                            } else {
                                worker(value, workerCallback);
                            }
                        } catch (e) {
                            failed = true;
                            callback(e);
                        }
                    }
                }

                if (!failed && i < length) {
                    _doWork(concurrency, list, worker, i, callback);
                }
            });
        }

        function _nextTick(func) {
            if (typeof process === 'undefined' || !(process.nextTick)) {
                setTimeout(func, 0);
            } else {
                process.nextTick(func);
            }
        }


        function _isArray(array) {
            return (Object.prototype.toString.call(array) === '[object Array]');
        }

        function _keys(obj) {
            if (typeof Object.keys !== 'function') {
                return Object.keys(obj);
            }

            var keys = [];
            for (var k in obj) {
                if (obj.hasOwnProperty(k)) {
                    keys.push(k);
                }
            }
            return keys;
        }

        return {
            sequential: _sequential,
            parallel: _parallel,
            map: _map
        };
    });
})(typeof define === 'function' ? define
   : typeof module !== 'undefined' ? function(name, deps, factory) {
       module.exports = factory.apply(this, []);
   }
   : function(name, deps, factory) {
       this[name] = factory.apply(this, []);
   });

;(function (define) {
    define('datagate/error', ['underscore'], function (_) {
        var captureStackTrace = Error.captureStackTrace || function () {};

        function DatagateVariableError (params) {
            Error.call(this);
            captureStackTrace(this, arguments.callee);

            this.name = 'DatagateVariableError';
            this.message = _createMessage(params.message, params.origin, params.result);
            this.origin = params.origin;
            this.result = params.result;
        }

        function DatagateArrayError (params) {
            Error.call(this);
            captureStackTrace(this, arguments.callee);

            this.name = 'DatagateArrayError';
            this.message = _createMessage(params.message, params.origin, params.result);
            this.origin = params.origin;
            this.result = params.result;

            this.errors = params.errors;
            this.errors_message = _createArrayErrorsMessage(this.errors);
        }


        function DatagateObjectError (params) {
            Error.call(this);
            captureStackTrace(this, arguments.callee);

            this.name = 'DatagateObjectError';
            this.message = _createMessage(params.message, params.origin, params.result);
            this.origin = params.origin;
            this.result = params.result;

            this.properties = params.properties;
            this.properties_message = _createObjectPropertiesMessage(this.properties);
        }

        function DatagateUnionError (params) {
            Error.call(this);
            captureStackTrace(this, arguments.callee);

            this.name = 'DatagateUnionError';
            this.message = _createMessage(params.message, params.origin, params.result);
            this.origin = params.origin;
            this.result = params.result;

            this.errors = params.errors;
            this.errors_message = _createArrayErrorsMessage(this.errors);
        }


        function _createMessage(message, origin, result) {
            return _.isFunction(message) ? message(origin, result) : message;
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

        return {
            VariableError: DatagateVariableError,
            ArrayError   : DatagateArrayError,
            ObjectError  : DatagateObjectError,
            UnionError   : DatagateUnionError
        };
    });
})(typeof define === 'function' ? define
   : typeof module !== 'undefined' ? function(name, deps, factory) {
       var dependencies = [
           require('underscore')
       ];
       module.exports = factory.apply(this, dependencies);
   }
   : function(name, deps, factory) {
       this[name] = factory.apply(this, [this._] );
   });

;(function (define) {
    define('datagate/filter', [], function () {
        var filter = {};

        var trim = String.prototype.trim || function () {
            return this.replace(/^\s+|\s+$/g, '');
        };

        filter.trim = function (val, callback) {
            if ((typeof val === 'string') && val + '') {
                val = trim.call(val);
            }

            callback(null, val);
        };

        filter.toLowerCase = function (val, callback) {
            if ((typeof val === 'string') && val + '') {
                val = String.prototype.toLowerCase.call(val);
            }

            callback(null, val);
        };

        filter.toUpperCase = function (val, callback) {
            if ((typeof val === 'string') && val + '') {
                val = String.prototype.toUpperCase.call(val);
            }

            callback(null, val);
        };

        filter.toStringType = function (val, callback) {
            callback(null, val + '');
        };

        filter.toNumberType = function (val, callback) {
            if (val === undefined || val === null || val === '') {
                callback(null, NaN);
            } else {
                callback(null, Number(val));
            }
        };

        filter.toBooleanType = function (val, callback) {
            if ( !val || val === '0' || val === null || val === undefined) {
                callback(null, false);
            } else {
                callback(null, true);
            }
        };


        filter.replace = function (from, to) {
            return function (val, callback) {
                if ((typeof val === 'string') && val + '') {
                    val = String.prototype.replace.call(val, from, to);
                }

                callback(null, val);
            };
        };

        filter.toDefault = function (to) {
            return function (val, callback) {
                if (val === undefined || val === null || val === '') {
                    callback(null, to);
                } else {
                    callback(null, val);
                }

            };
        };

        filter.custom = function (custom_function) {
            if (typeof custom_function !== 'function') {
                throw Error('Argument must be function in datagate custom filter.');
            }

            return custom_function;
        };

        return filter;
    });
})(typeof define === 'function' ? define
   : typeof module !== 'undefined' ? function(name, deps, factory) {
       module.exports = factory.apply(this, []);
   }
   : function(name, deps, factory) {
       this[name] = factory.apply(this, [] );
   });

(function (define) {
    define('datagate/validator', ['underscore'], function (_) {
        var validator = {};

        var validations = {
            NumberType: function (val, callback) {
                if (_.isNumber(val)) {
                    callback(null, val);
                } else {
                    callback(Error());
                }
            },

            StringType: function (val, callback) {
                if (_.isString(val)) {
                    callback(null, val);
                } else {
                    callback(Error());
                }
            },

            BooleanType: function (val, callback) {
                if (_.isBoolean(val)) {
                    callback(null, val);
                } else {
                    callback(Error());
                }
            },

            FunctionType: function (val, callback) {
                if (_.isFunction(val)) {
                    callback(null, val);
                } else {
                    callback(Error());
                }
            },

            ArrayType: function (val, callback) {
                if (_.isArray(val)) {
                    callback(null, val);
                } else {
                    callback(Error());
                }
            },

            ObjectType: function (val, callback) {
                if (Object.prototype.toString.call(val) === '[object Object]') {
                    callback(null, val);
                } else {
                    callback(Error());
                }
            },

            DateType: function (val, callback) {
                if (_.isDate(val)) {
                    callback(null, val);
                } else {
                    callback(Error());
                }
            },

            RegExpType: function (val, callback) {
                if (_.isRegExp(val)) {
                    callback(null, val);
                } else {
                    callback(Error());
                }
            },

            Empty: function (val, callback) {
                if (val === null || val === undefined || val === '') {
                    callback(null, val);
                } else {
                    callback(Error());
                }
            },

            Null: function (val, callback) {
                if (val === null) {
                    callback(null, val);
                } else {
                    callback(Error());
                }
            },

            Undefined: function (val, callback) {
                if (val === undefined) {
                    callback(null, val);
                } else {
                    callback(Error());
                }
            },

            'NaN': function (val, callback) {
                if (_.isNaN(val)) {
                    callback(null, val);
                } else {
                    callback(Error());
                }
            },


            Integer: function (val, callback) {
                if ( (_.isNumber(val) || _.isString(val)) &&
                     (val + '').match(/^-?[0-9]+$/)
                   ) {
                    callback(null, val);
                } else {
                    callback(Error());
                }
            },

            Alphabet: function (val, callback) {
                if (_.isString(val) && (val + '').match(/^[a-zA-Z]+$/)) {
                    callback(null, val);
                } else {
                    callback(Error());
                }
            },

            Alphanumeric: function (val, callback) {
                if ( (_.isString(val) && (val + '').match(/^[a-zA-Z0-9]+$/)) ||
                     (_.isNumber(val) && (val + '').match(/^[0-9]+$/))
                   ) {
                    callback(null, val);
                } else {
                    callback(Error());
                }
            },

            Decimal: function (val, callback) {
                if ( (_.isNumber(val) || _.isString(val)) &&
                     (val + '').match(/^\-?[0-9]+(?:\.[0-9]*)?(?:[eE][\+\-]?(?:[0-9]+))?$/)
                   ) {
                    callback(null, val);
                } else {
                    callback(Error());
                }
            },

            Ascii: function (val, callback) {
                if (!_.isNaN(val) &&
                    (_.isNumber(val) || _.isString(val)) &&
                    (val + '').match(/^[!-~]+$/)
                   ) {
                    callback(null, val);
                } else {
                    callback(Error());
                }
            },


            Url: function (val, callback) {
                var pattern = /^(?:(?:ht|f)tp(?:s?)\:\/\/|~\/|\/)?(?:\w+:\w+@)?(localhost|(?:(?:[\-\w\d{1-3}]+\.)+(?:com|org|cat|coop|int|pro|tel|xxx|net|gov|mil|biz|info|mobi|name|aero|jobs|edu|co\.uk|ac\.uk|it|fr|tv|museum|asia|local|travel|[a-z]{2}))|((\b25[0-5]\b|\b[2][0-4][0-9]\b|\b[0-1]?[0-9]?[0-9]\b)(\.(\b25[0-5]\b|\b[2][0-4][0-9]\b|\b[0-1]?[0-9]?[0-9]\b)){3}))(?::[\d]{1,5})?(?:(?:(?:\/(?:[\-\w~!$+|.,="'\(\)_\*:]|%[a-f\d]{2})+)+|\/)+|\?|#)?(?:(?:\?(?:[\-\w~!$+|.,*:]|%[a-f\d{2}])+=?(?:[\-\w~!$+|.,*:=]|%[a-f\d]{2})*)(?:&(?:[\-\w~!$+|.,*:]|%[a-f\d{2}])+=?(?:[\-\w~!$+|.,*:=]|%[a-f\d]{2})*)*)*(?:#(?:[\-\w~!$ |\/.,*:;=]|%[a-f\d]{2})*)?$/i;

                if (pattern.test(val)) {
                    callback(null, val);
                } else {
                    callback(Error());
                }
            },

            Email: function (val, callback) {
                var pattern = /^(?:[\w\!\#\$\%\&\'\*\+\-\/\=\?\^\`\{\|\}\~]+\.)*[\w\!\#\$\%\&\'\*\+\-\/\=\?\^\`\{\|\}\~]+@(?:(?:(?:[a-zA-Z0-9](?:[a-zA-Z0-9\-](?!\.)){0,61}[a-zA-Z0-9]?\.)+[a-zA-Z0-9](?:[a-zA-Z0-9\-](?!$)){0,61}[a-zA-Z0-9]?)|(?:\[(?:(?:[01]?\d{1,2}|2[0-4]\d|25[0-5])\.){3}(?:[01]?\d{1,2}|2[0-4]\d|25[0-5])\]))$/;

                if (pattern.test(val)) {
                    callback(null, val);
                } else {
                    callback(Error());
                }
            },

            Date: function (val, callback) {
                var pattern = /^\d{4}-(?:0[0-9]{1}|1[0-2]{1})-[0-9]{2}$/;
                var time = Date.parse(val);

                if (pattern.test(val) && !_.isNaN(time)) {
                    callback(null, val);
                } else {
                    callback(Error());
                }
            },

            Time: function (val, callback) {
                if (!_.isString(val)) {
                    callback(Error());
                    return;
                }

                var pattern = /^(\d{2}):(\d{2}):(\d{2})$/;
                var matches = val.match(pattern);

                    if (!matches) {
                        callback(Error());
                        return;
                    }

                var h = matches[1];
                var m = matches[2];
                var s = matches[3];

                if ( (h >= 0 && h < 24) && (m >= 0 && m < 60) && (s >= 0 && s < 60) ) {
                    callback(null, val);
                } else {
                    callback(Error());
                }
            }
        };

        _.each(validations, function (validation, name) {
            var is  = 'is' + name;
            var not = 'not' + name;

                validator[is] = validation;
            validator[not] = function (val, callback) {
                validation(val, function (err, result) {
                    if (err) {
                        callback(null, val);
                    } else {
                        callback(Error());
                    }
                });
            };
        });

        validator.required = validator.notUndefined;

        validator.max = validator.maximum = function (max) {
            return function (val, callback) {
                validator.isDecimal(val, function (err, result) {
                    if (err) {
                        callback(err);
                    } else if (parseFloat(val) > max) {
                        callback(Error());
                    } else {
                        callback(null, val);
                    }
                });
            };
        };

        validator.min = validator.minimum = function (min) {
            return function (val, callback) {
                validator.isDecimal(val, function (err, result) {
                    if (err) {
                        callback(err);
                    } else if (parseFloat(val) < min) {
                        callback(Error());
                    } else {
                        callback(null, val);
                    }
                });
            };
        };

        validator.maxLength = function (length) {
            return function (val, callback) {
                if (_.isString(val) && val.length <= length) {
                    callback(null, val);
                } else if (_.isNumber(val) && !_.isNaN(val) && (val + '').length <= length) {
                    callback(null, val);
                } else {
                    callback(Error());
                }
            };
        };

        validator.minLength = function (length) {
            return function (val, callback) {
                if (_.isString(val) && val.length >= length) {
                    callback(null, val);
                } else if (_.isNumber(val) && !_.isNaN(val) && (val + '').length >= length) {
                    callback(null, val);
                } else {
                    callback(Error());
                }
            };
        };


        validator.isPattern = function (pattern) {
            if (!_.isRegExp(pattern)) {
                throw Error('Argument must be regexp type in datagate pattern validator.');
            }

            return function (val, callback) {
                if (!pattern.test(val)) {
                    callback(Error());
                } else {
                    callback(null, val);
                }
            };
        };

        validator.notPattern = function (pattern) {
            if (!_.isRegExp(pattern)) {
                throw Error('Argument must be regexp type in datagate pattern validator.');
            }

            return function (val, callback) {
                if (!pattern.test(val)) {
                    callback(null, val);
                } else {
                    callback(Error());
                }
            };
        };


        validator.isIn = function (entries) {
            return function (val, callback) {
                if (_.indexOf(entries, val) < 0) {
                    callback(Error());
                } else {
                    callback(null, val);
                }
            };
        };

        validator.notIn = function (entries) {
            return function (val, callback) {
                if (_.indexOf(entries, val) < 0) {
                    callback(null, val);
                } else {
                    callback(Error());
                }
            };
        };

        validator.custom = function (custom_function) {
            if (typeof custom_function !== 'function') {
                throw Error('Argument must be function in datagate custom validator.');
            }

            return custom_function;
        };

        return validator;
    });
})(typeof define === 'function' ? define
   : typeof module !== 'undefined' ? function(name, deps, factory) {
       var dependencies = [
           require('underscore')
       ];
       module.exports = factory.apply(this, dependencies);
   }
   : function(name, deps, factory) {
       var dependencies = [ this._ ];
       this[name] = factory.apply(this, dependencies);
   });

(function (define) {
    define('datagate/array', ['underscore', 'datagate/plow', 'datagate/error'], function (_, plow, DatagateError) {
        var ArrayError = DatagateError.ArrayError;

        return function createNewArrayGate(gate, error_message) {
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
    });
})(typeof define === 'function' ? define
   : typeof module !== 'undefined' ? function(name, deps, factory) {
       var dependencies = [
           require('underscore'),
           require('./plow'),
           require('./error')
       ];
       module.exports = factory.apply(this, dependencies);
   }
   : function(name, deps, factory) {
       var dependencies = [
           this._, this['datagate/plow'], this['datagate/error']
       ];
       this[name] = factory.apply(this, dependencies);
   });

(function (define) {
    define('datagate/object', ['underscore', 'datagate/plow', 'datagate/error'], function (_, plow, DatagateError) {
        var ObjectError = DatagateError.ObjectError;

        return function createNewObjectGate(entries, error_message) {
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

                plow.map(properties, function (property, next) {
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
                            var total_err = new ObjectError({
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
    });
})(typeof define === 'function' ? define
   : typeof module !== 'undefined' ? function(name, deps, factory) {
       var dependencies = [
           require('underscore'),
           require('./plow'),
           require('./error')
       ];
       module.exports = factory.apply(this, dependencies);
   }
   : function(name, deps, factory) {
       var dependencies = [
           this._, this['datagate/plow'], this['datagate/error']
       ];
       this[name] = factory.apply(this, dependencies);
   });

(function (define) {
    define('datagate/union', ['datagate/plow', 'datagate/error'], function (plow, DatagateError) {
        var UnionError = DatagateError.UnionError;

        return function createNewUnionGate(gates, error_message) {
            if (error_message === undefined) {
                error_message = 'Invalid value in union.';
            }

            return function (value, callback) {
                if (!gates) {
                    return callback(null, value);
                }

                var errors = [];
                var last_result;

                plow.map(gates, function (gate, next) {
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
    });
})(typeof define === 'function' ? define
   : typeof module !== 'undefined' ? function(name, deps, factory) {
       var dependencies = [
           require('./plow'),
           require('./error')
       ];
       module.exports = factory.apply(this, dependencies);
   }
   : function(name, deps, factory) {
       var dependencies = [
           this['datagate/plow'], this['datagate/error']
       ];
       this[name] = factory.apply(this, dependencies);
   });

;(function (define) {
    var deps = [
        'underscore', 'datagate/plow',
        'datagate/error', 'datagate/array', 'datagate/object', 'datagate/union', 'datagate/filter', 'datagate/validator'
    ];

    define('datagate', deps, function (_, plow, DatagateError, array, object, union, filter, validator) {
        var VariableError = DatagateError.VariableError;

        var datagate = function datagate(entries, root_error_message) {
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

                            // if (_.isFunction(error_message)) {
                            //     message = error_message(origin, val);
                            // }

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

                plow.sequential(tasks, function (err, origin, result) {
                    if (!err) {
                        callback(null, result);
                    } else {
                        callback(err, err.result);
                    }
                });
            };
        };

        datagate.array   = array;
        datagate.object  = object;
        datagate.union   = union;
        datagate.filter  = filter;
        datagate.validator = validator;

        return datagate;
    });
})(typeof define === 'function' ? define
   : typeof module !== 'undefined' ? function(name, deps, factory) {
       var dependencies = [
           require('underscore'),
           require('./plow'),
           require('./error'),
           require('./array'),
           require('./object'),
           require('./union'),
           require('./filter'),
           require('./validator')
       ];
       module.exports = factory.apply(this, dependencies);
   }
   : function(name, deps, factory) {
       var dependencies = [
           this._, this['datagate/plow'], this['datagate/error'],
           this['datagate/array'], this['datagate/object'], this['datagate/union'],
           this['datagate/filter'], this['datagate/validator']
       ];
       this[name] = factory.apply(this, dependencies);
   });
