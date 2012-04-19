(function () {
    var root = this;
    var filter = {};

    if (typeof module !== 'undefined' && module.exports) {
        if (Object.keys(module.exports).length) {
            module.exports.filter = filter;
        } else {
            module.exports = filter;
        }
    } else if (typeof root.datagate !== 'undefined') {
        root.datagate.filter = filter;
    }

    filter.trim = function (val, callback) {
        if ((typeof val === 'string') && val + '') {
            val = String.prototype.trim.call(val);
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
}).call(this);