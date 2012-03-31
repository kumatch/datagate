
function DatagateVariableError (params) {
    Error.call(this);
    Error.captureStackTrace(this, arguments.callee);

    this.name = 'DatagateVariableError';
    this.message = params.message;
    this.origin = params.origin;
    this.result = params.result;
};

function DatagateArrayError (params) {
    Error.call(this);
    Error.captureStackTrace(this, arguments.callee);

    this.name = 'DatagateArrayError';
    this.message = params.message;
    this.origin = params.origin;
    this.result = params.result;
    this.errors = params.errors;
};

function DatagateObjectError (params) {
    Error.call(this);
    Error.captureStackTrace(this, arguments.callee);

    this.name = 'DatagateObjectError';
    this.message = params.message;
    this.origin = params.origin;
    this.result = params.result;
    this.errors = params.errors;
};

function DatagateUnionError (params) {
    Error.call(this);
    Error.captureStackTrace(this, arguments.callee);

    this.name = 'DatagateUnionError';
    this.message = params.message;
    this.origin = params.origin;
    this.result = params.result;
    this.errors = params.errors;
};


DatagateVariableError.prototype.__proto__ = Error.prototype;
DatagateArrayError.prototype.__proto__ = Error.prototype;
DatagateObjectError.prototype.__proto__ = Error.prototype;
DatagateUnionError.prototype.__proto__ = Error.prototype;

exports.VariableError = DatagateVariableError;
exports.ArrayError    = DatagateArrayError;
exports.ObjectError   = DatagateObjectError;
exports.UnionError    = DatagateUnionError;