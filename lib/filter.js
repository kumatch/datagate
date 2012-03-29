"use strict";

exports.trim = function (val, callback) {
    if ((typeof val === 'string') && val + '') {
        val = String.prototype.trim.call(val);
    }

    callback(null, val);
};

exports.toLowerCase = function (val, callback) {
    if ((typeof val === 'string') && val + '') {
        val = String.prototype.toLowerCase.call(val);
    }

    callback(null, val);
};

exports.toUpperCase = function (val, callback) {
    if ((typeof val === 'string') && val + '') {
        val = String.prototype.toUpperCase.call(val);
    }

    callback(null, val);
};

exports.toStringType = function (val, callback) {
    callback(null, val + '');
};

exports.toNumberType = function (val, callback) {
    if (val === undefined || val === null || val === '') {
        callback(null, NaN);
    } else {
        callback(null, Number(val));
    }
};

exports.toBooleanType = function (val, callback) {
    if ( !val || val === '0' || val === null || val === undefined) {
        callback(null, false);
    } else {
        callback(null, true);
    }
};


exports.replace = function (from, to) {
    return function (val, callback) {
        if ((typeof val === 'string') && val + '') {
            val = String.prototype.replace.call(val, from, to);
        }

        callback(null, val);
    };
};

exports.toDefault = function (to) {
    return function (val, callback) {
        if (val === undefined || val === null || val === '') {
            callback(null, to);
        } else {
            callback(null, val);
        }

    };
};