// 
// Author:: Tom Tang <principleware@gmail.com>
// Copyright:: Copyright (c) 2017, Tom Tang
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


import { DummyPromise } from './promise-like';
import * as typeChecker from '../typing/type-checker';

/**
 * Lifts a single value or a function into a Promise-like object.
 * Provides a method of wrapping a single value or a function  into a Promise,
 * in order that the following operation 
 * may conform to the standard Promise operation.
 * In some scenario, we may first attempt to get a value from cache.
 * Motivation.
 * In this case, we need to return a value. However, if the value is
 * not available in the cache, we may have to go ahead to load it
 * asynchronously. Loading a value asynchronously usually returns
 * a Promise. To untify the return from two cases, we
 * escalate a single value into a Promise.
 */
export function lift<T>(value: T, thisArg: Object): PromiseLike<T> {
    /*jslint unparam: true */
    return new DummyPromise(function(resolve, reject) {
        if (typeChecker.isFunction(value)) {
            const restArgs = [];
            /*jslint plusplus: true */
            for (let i = 2; i < arguments.length; i++) {
                restArgs.push(arguments[i]);
            }
            const ret = value.apply(thisArg || null, restArgs);
            resolve(ret);
        } else {
            resolve(value);
        }
    });
}

/**
 * Lifts a value into an rejected state.
 */
export function liftIntoReject<T>(value: T): PromiseLike<T> {
    return new DummyPromise(function(resolve, reject) {
        /*jslint unparam: true */
        reject(value);
    });
}

/**
 * Converts a given promise into another promise which ensures that
 * the given guard evalutes to be true from the state of the given promise.
 */
export function liftWithGuard<T>(promise: PromiseLike<T>, guard: (x: T) => boolean): PromiseLike<T> {
    return promise.then(function(data) {
        return new DummyPromise(function(resolve, reject) {
            if (guard(data)) {
                resolve(data);
            } else {
                reject(data);
            }
        });
    });
}

/**
 * Settles a promise.
 */
export function settle<T>(promise: PromiseLike<T>): PromiseLike<T> {
    return new DummyPromise(function(resolve) {
        promise.then(function(value) {
            resolve({
                state: 'fulfilled',
                data: value
            });
        }, function() {
            resolve({
                state: 'rejected'
            });
        });
    });
}

/**
 * Converts the given promise into a promise which does not reject anything.
 */
export function liftToPredicate<T>(promise: PromiseLike<T>, guard: (x: T) => boolean): PromiseLike<boolean> {
    return new DummyPromise(function(resolve, reject) {
        /*jslint unparam: true */
        promise.then(function(data) {
            resolve(guard(data));
        }, function() {
            resolve(false);
        });
    });
}


export interface IPipelineSettings<U> {
    validator?: (x) => boolean,
    adaptor: (x) => U
}

/**
 * Transforms a given promise with additonal pipeline processing.
 * Specifically, in this method, compared to the given promise, the return
 * promise contains validating and adpating stages.
 */
export function readerPipeline<T, U>(readerPromise: PromiseLike<T>, settings: IPipelineSettings<U>) {
    return readerPromise
        .then(function(data) {
            if (settings.validator) {
                if (!settings.validator(data)) {
                    throw new Error('Data is not valid: ' + data);
                }
            }
            return data;
        })
        .then(function(data) {
            return settings.adaptor(data);
        });
}

/**
 * Transforms a given promise into one promise with our own implementation.
 */
export function transform<T>(promise: PromiseLike<T>): PromiseLike<T> {
    return new DummyPromise(function(resolve, reject) {
        promise.then(resolve, reject);
    });
}
