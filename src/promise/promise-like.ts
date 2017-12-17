// 
// Author:: Xiaolong Tang <principleware@gmail.com>
// Copyright:: Copyright (c) 2017, Xiaolong Tang
// 
// Permission is hereby granted, free of charge, to any person obtaining
// a copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to
// permit persons to whom the Software is furnished to do so, subject to
// the following conditions:
// 
// The above copyright notice and this permission notice shall be
// included in all copies or substantial portions of the Software.
// 
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
// EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
// NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
// LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
// OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
// WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
// 
// Except as contained in this notice, the name(s) of the above copyright
// holders shall not be used in advertising or otherwise to promote the
// sale, use or other dealings in this Software without prior written
// authorization.

function asap(fn) {
    setTimeout(fn, 1);
}

function bind(fn, thisArg) {
    return function() {
        fn.apply(thisArg, arguments);
    };
}

var isArray = Array.isArray || function(value) { return Object.prototype.toString.call(value) === "[object Array]"; };

/**
 * Take a potentially misbehaving resolver function and make sure
 * onFulfilled and onRejected are only called once.
 *
 * Makes no guarantees about asynchrony.
 */
function doResolve(fn, onFulfilled, onRejected) {
    var done = false;
    try {
        fn(function(value) {
            if (done) {
                return;
            }
            done = true;
            onFulfilled(value);
        }, function(reason) {
            if (done) {
                return;
            }
            done = true;
            onRejected(reason);
        });
    } catch (ex) {
        if (done) {
            return;
        }
        done = true;
        onRejected(ex);
    }
}

function handle(deferred) {
    var me = this;
    if (this._state === null) {
        this._deferreds.push(deferred);
        return;
    }
    asap(function() {
        var cb, ret;
        cb = me._state ? deferred.onFulfilled : deferred.onRejected;
        if (cb === null) {
            (me._state ? deferred.resolve : deferred.reject)(me._value);
            return;
        }
        try {
            ret = cb(me._value);
        }
        catch (e) {
            deferred.reject(e);
            return;
        }
        deferred.resolve(ret);
    });
}


function finale() {
    var i, len;
    /*jslint plusplus:true */
    for (i = 0, len = this._deferreds.length; i < len; i++) {
        handle.call(this, this._deferreds[i]);
    }
    this._deferreds = null;
}

function reject(newValue) {
    this._state = false;
    this._value = newValue;
    finale.call(this);
}

function resolve(newValue) {
    try { //Promise Resolution Procedure: https://github.com/promises-aplus/promises-spec#the-promise-resolution-procedure
        if (newValue === this) {
            throw new TypeError('A promise cannot be resolved with itself.');
        }
        if (newValue && (typeof newValue === 'object' || typeof newValue === 'function')) {
            var then = newValue.then;
            if (typeof then === 'function') {
                doResolve(bind(then, newValue), bind(resolve, this), bind(reject, this));
                return;
            }
        }
        this._state = true;
        this._value = newValue;
        finale.call(this);
    } catch (e) { reject.call(this, e); }
}

/**
 * This callback is used to construct a DummyPromise.
 * @callback DummyPromise~ctorCallback
 * @param {Function} resolve - A function to be called once the promise is successfully resolved.
 * @param {Function} reject - A function to be called once the promise fails to be resolved.
 */

/**
 * Defines a dummy promise, which simulates the behavior of a normal Promise
 * but is suitable used in synchronous call.
 * This resulted object is also a jQuery deferred object, therefore,
 * it will be resolved by the jQuery deferred object if it is a resolved value in
 * the jQuery deferred object.
 * @class
 * @constructs DummyPromise
 * @param {DummyPromise~ctorCallback} fn - The given function 
 * @throws {} - Some error 
 */
export function DummyPromise<T>(fn: (resolve: (value?: T | PromiseLike<T>) => void, reject: (reason?) => void) => void) {
    if (typeof this !== 'object') {
        throw new TypeError('Promises must be constructed via new');
    }
    if (typeof fn !== 'function') {
        throw new TypeError('not a function');
    }
    this._state = null;
    this._value = null;
    this._deferreds = [];

    doResolve(fn, bind(resolve, this), bind(reject, this));
}


function Handler(onFulfilled, onRejected, resolve, reject) {
    this.onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : null;
    this.onRejected = typeof onRejected === 'function' ? onRejected : null;
    this.resolve = resolve;
    this.reject = reject;
}


DummyPromise.prototype['catch'] = function(onRejected) {
    return this.then(null, onRejected);
};

DummyPromise.prototype.then = function(onFulfilled, onRejected) {
    const me = this;
    return new DummyPromise(function(resolve, reject) {
        handle.call(me, new Handler(onFulfilled, onRejected, resolve, reject));
    });
};

DummyPromise.prototype.all = function(arrayArg) {
    var args = Array.prototype.slice.call(arguments.length === 1 && isArray(arrayArg) ? arrayArg : arguments);

    return new DummyPromise(function(resolve, reject) {
        if (args.length === 0) {
            return resolve([]);
        }
        var remaining = args.length, i;
        function res(i, val) {
            try {
                if (val && (typeof val === 'object' || typeof val === 'function')) {
                    var then = val.then;
                    if (typeof then === 'function') {
                        then.call(val, function(val) { res(i, val); }, reject);
                        return;
                    }
                }
                args[i] = val;

                /*jslint plusplus: true */
                if (--remaining === 0) {
                    resolve(args);
                }
            } catch (ex) {
                reject(ex);
            }
        }
        /*jslint plusplus: true */         for (i = 0; i < args.length; i++) {
            res(i, args[i]);
        }
    });
};

DummyPromise.prototype.resolve = function(value) {
    if (value && typeof value === 'object' && value.constructor === DummyPromise) {
        return value;
    }

    return new DummyPromise(function(resolve) {
        resolve(value);
    });
};

DummyPromise.prototype.reject = function(value) {
    /*jslint unparam: true */
    return new DummyPromise(function(resolve, reject) {
        reject(value);
    });
};

DummyPromise.prototype.race = function(values) {
    return new DummyPromise(function(resolve, reject) {
        var i, len;
        /*jslint plusplus: true */
        for (i = 0, len = values.length; i < len; i++) {
            values[i].then(resolve, reject);
        }
    });
};

DummyPromise.prototype.always = function(onFulfilled) {
    return this.then(onFulfilled, onFulfilled);
};

DummyPromise.prototype.done = function(onFulfilled) {
    return this.then(onFulfilled);
};

DummyPromise.prototype.fail = function(onRejected) {
    return this.then(null, onRejected);
};

DummyPromise.prototype.promise = function() {
    return this;
};

DummyPromise.prototype.progress = function() {
    return this;
};
