"use strict";

var _ = require('underscore');

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
        if (val === null
            || val === undefined
            || val === ''
           ) {
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

    NaN: function (val, callback) {
        if (_.isNaN(val)) {
            callback(null, val);
        } else {
            callback(Error());
        }
    },


    Integer: function (val, callback) {
        if ( (_.isNumber(val) || _.isString(val))
             && (val + '').match(/^-?[0-9]+$/)
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
        if ( (_.isString(val) && (val + '').match(/^[a-zA-Z0-9]+$/))
             || (_.isNumber(val) && (val + '').match(/^[0-9]+$/))
           ) {
            callback(null, val);
        } else {
            callback(Error());
        }
    },

    Decimal: function (val, callback) {
        if ( (_.isNumber(val) || _.isString(val))
             && (val + '').match(/^\-?[0-9]+(?:\.[0-9]*)?(?:[eE][\+\-]?(?:[0-9]+))?$/)
           ) {
            callback(null, val);
        } else {
            callback(Error());
        }
    },

    Ascii: function (val, callback) {
        if (!_.isNaN(val)
            && (_.isNumber(val) || _.isString(val))
             && (val + '').match(/^[!-~]+$/)
           ) {
            callback(null, val);
        } else {
            callback(Error());
        }
    }
};

_.each(validations, function (validation, name) {
    var is  = 'is' + name;
    var not = 'not' + name;

    exports[is] = validation;
    exports[not] = function (val, callback) {
        validation(val, function (err, result) {
            if (err) {
                callback(null, val);
            } else {
                callback(Error());
            }
        });
    };
});

exports.required = exports.notUndefined;

exports.max = exports.maximum = function (max) {
    return function (val, callback) {
        exports.isDecimal(val, function (err, result) {
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

exports.min = exports.minimum = function (min) {
    return function (val, callback) {
        exports.isDecimal(val, function (err, result) {
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

exports.maxLength = function (length) {
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

exports.minLength = function (length) {
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


exports.isIn = function (entries) {
    return function (val, callback) {
        if (_.indexOf(entries, val) < 0) {
            callback(Error());
        } else {
            callback(null, val);
        }
    };
};

exports.notIn = function (entries) {
    return function (val, callback) {
        if (_.indexOf(entries, val) < 0) {
            callback(null, val);
        } else {
            callback(Error());
        }
    };
};



exports.custom = function (custom_function) {
    if (typeof custom_function !== 'function') {
        throw Error('Argument must be function in datagate custom validator.');
    };

    return custom_function;
};
