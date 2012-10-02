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
