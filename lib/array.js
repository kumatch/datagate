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
