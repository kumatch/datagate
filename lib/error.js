exports = module.exports = DatagateError;

function DatagateError (params) {
    Error.call(this);
    Error.captureStackTrace(this, arguments.callee);

    this.name = 'DatagateVariableError';
    this.message = params.message;
    this.origin = params.origin;
    this.result = params.result;
};

DatagateError.prototype.__proto__ = Error.prototype;

