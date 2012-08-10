var _ = require('./utils')._;

exports.VariableError = DatagateVariableError;
exports.ArrayError    = DatagateArrayError;
exports.ObjectError   = DatagateObjectError;
exports.UnionError    = DatagateUnionError;


var captureStackTrace = Error.captureStackTrace || function () {};

function DatagateVariableError (params) {
    Error.call(this);
    captureStackTrace(this, arguments.callee);

    this.name = 'DatagateVariableError';
    this.message = _createMessage(params.message, params.origin, params.result);
    this.origin = params.origin;
    this.result = params.result;
}

function DatagateArrayError (params) {
    Error.call(this);
    captureStackTrace(this, arguments.callee);

    this.name = 'DatagateArrayError';
    this.message = _createMessage(params.message, params.origin, params.result);
    this.origin = params.origin;
    this.result = params.result;

    this.errors = params.errors;
    this.errors_message = _createArrayErrorsMessage(this.errors);
}


function DatagateObjectError (params) {
    Error.call(this);
    captureStackTrace(this, arguments.callee);

    this.name = 'DatagateObjectError';
    this.message = _createMessage(params.message, params.origin, params.result);
    this.origin = params.origin;
    this.result = params.result;

    this.properties = params.properties;
    this.properties_message = _createObjectPropertiesMessage(this.properties);
}

function DatagateUnionError (params) {
    Error.call(this);
    captureStackTrace(this, arguments.callee);

    this.name = 'DatagateUnionError';
    this.message = _createMessage(params.message, params.origin, params.result);
    this.origin = params.origin;
    this.result = params.result;

    this.errors = params.errors;
    this.errors_message = _createArrayErrorsMessage(this.errors);
}


function _createMessage(message, origin, result) {
    return _.isFunction(message) ? message(origin, result) : message;
}

function _createObjectPropertiesMessage(errors) {
    var keys = _.keys(errors);
    var c = keys.length;
    var message = {};

    for (var i = 0; i < c; i++) {
        var key = keys[i];
        var error = errors[key];

        if (error.name === 'DatagateObjectError') {
            message[key] = error.properties_message;
        } else if (error.name === 'DatagateArrayError') {
            message[key] = error.errors_message;
        } else {
            message[key] = error.message;
        }
    }

    return message;
}

function _createArrayErrorsMessage(errors) {

    return _.map(errors, function (error) {
        if (error.name === 'DatagateObjectError') {
            return error.properties_message;
        } else if (error.name === 'DatagateArrayError' || error.name === 'DatagateUnionError') {
            return error.errors_message;
        } else {
            return error.message;
        }
    });
}

DatagateVariableError.prototype = new Error();
DatagateArrayError.prototype    = new Error();
DatagateObjectError.prototype   = new Error();
DatagateUnionError.prototype    = new Error();
