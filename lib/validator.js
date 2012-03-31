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
        if ((val + '').match(/^-?[0-9]+$/)) {
            callback(null, val);
        } else {
            callback(Error());
        }
    },

    Alphabet: function (val, callback) {
        if (typeof val === 'string' && (val + '').match(/^[a-z]+$/i)) {
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