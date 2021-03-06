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
