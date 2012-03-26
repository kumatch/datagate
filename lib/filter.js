"use strict";

exports.trim = function (val, callback) {
    if (val + '') {
        val = String.prototype.trim.call(val);
    }

    callback(null, val);
};

exports.toLowerCase = function (val, callback) {
	if (val + '') {
        val = String.prototype.toLowerCase.call(val);
    }

    callback(null, val);
};

exports.replace = function (from, to) {
    return function (val, callback) {
	    if (val + '') {
            val = String.prototype.replace.call(val, from, to);
        }

        callback(null, val);
    };
};