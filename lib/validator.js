"use strict";

exports.notEmpty = function (val, callback) {
    if (val === null
        || val === undefined
        || (val + '').match(/^[\s\t\r\n]*$/)
       ) {
        callback(Error());
    } else {
        callback(null, val);
    }
};

exports.isInteger = function (val, callback) {
    if (!(val + '').match(/^-?[0-9]+$/)) {
        callback(Error());
    } else {
        callback(null, val);
    }
};

exports.isAlphabet = function (val, callback) {
    if (!(val + '').match(/^[a-z]+$/i)) {
        callback(Error());
    } else {
        callback(null, val);
    }
};
