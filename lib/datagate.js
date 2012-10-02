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
