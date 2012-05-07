// plow.js 0.1.1
// (c) 2012 Yosuke Kumakura
// https://github.com/kumatch/plow
//
// Licensed under the MIT license:
// http://www.opensource.org/licenses/MIT

exports.sequential = _sequential;
exports.parallel   = _parallel;
exports.map  = _map;
exports.nextTick = _nextTick;

var DEFAULT_CONCURRENCY = 10;

function _sequential(list, end) {
    var tasks = Array.prototype.slice.call(list);

    end = end || function () {};

    if (!tasks.length) {
        end();
        return;
    }

    (function next(err) {
        if (err) {
            end(err);
        } else {
            var task = tasks.shift();
            var args = Array.prototype.slice.call(arguments);

            if (tasks.length > 0) {
                args = args.slice(1).concat(next);
            } else {
                args = args.slice(1).concat(end);
            }

            exports.nextTick(function () {
                try {
                    task.apply(null, args);
                } catch (e) {
                    end(e);
                }
            });
        }
    })(null);
}



function _parallel(tasks, end) {
    var completed = 0;
    var failed = false;
    var is_array = _isArray(tasks);
    var results, length;

    if (is_array) {
        results = [];
        length = tasks.length;
    } else {
        results = {};
        length = _keys(tasks).length;
    }

    end = end || function () {};

    if (!length) {
        end(null, results);
        return;
    }



    var worker = function (task, index, next) {
        task(function (err, value) {
            if (err) {
                next(err);
            } else {
                next(null, {
                    index: index,
                    value: value
                });
            }
        });
    };

    var concurrency = 1;
    var index = 0;

    _doWork(concurrency, tasks, worker, index, function(err, result) {

        if (err) {
            end(err);
            return false;
        } else {
            completed += 1;
            results[result.index] = result.value;

            if (completed === length) {
                end(null, results);
            }
            return true;
        }
    });
}


function _map(list, worker, end) {
    var length = list.length;
    var results = [];
    var failed = false;

    end = end || function () {};

    if (!length) {
        end(null, []);
    } else {
        _doWork(DEFAULT_CONCURRENCY, list, worker, 0, function(err, result) {
            if (err) {
                end(err, results);
                return false;
            } else {
                results.push(result);

                if (results.length === length) {
                    end(null, results);
                }
                return true;
            }
        });
    }
}


function _doWork(concurrency, list, worker, currentIndex, callback) {
    var failed = false;
    var is_array  = _isArray(list);
    var keys, length;

    if (is_array) {
        length = list.length;
    } else {
        keys = _keys(list);
        length = keys.length;
    }

    function workerCallback (err, result) {
        if (!callback(err, result)) {
            failed = true;
        }
    }

    exports.nextTick(function () {
        for (var i = currentIndex; (i < length && i < (currentIndex + concurrency)); i++) {
            if (!failed) {
                try {
                    var value, index;

                    if (is_array) {
                        index = i;
                        value = list[index];
                    } else {
                        index = keys[i];
                        value = list[index];
                    }

                    if (worker.length > 2) {
                        worker(value, index, workerCallback);
                    } else {
                        worker(value, workerCallback);
                    }
                } catch (e) {
                    failed = true;
                    callback(e);
                }
            }
        }

        if (!failed && i < length) {
            _doWork(concurrency, list, worker, i, callback);
        }
    });
}


function _nextTick(func) {
    if (typeof process === 'undefined' || !(process.nextTick)) {
        setTimeout(func, 0);
    } else {
        process.nextTick(func);
    }
}


function _isArray(array) {
    return (Object.prototype.toString.call(array) === '[object Array]');
}

function _keys(obj) {
    if (typeof Object.keys !== 'function') {
        return Object.keys(obj);
    }

    var keys = [];
    for (var k in obj) {
            if (obj.hasOwnProperty(k)) {
                keys.push(k);
            }
    }
    return keys;
}
