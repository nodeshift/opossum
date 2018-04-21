'use strict';

/**
 * Returns a promise that resolves if the parameter
 * 'x' evaluates to >= 0. Otherwise the returned promise fails.
 */

/* eslint prefer-promise-reject-errors: "off" */
function passFail (x) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      (x > 0) ? resolve(x) : reject(`Error: ${x} is < 0`);
    }, 100);
  });
}

/**
 * A function returning a promise that resolves
 * after 1 second.
 */
function slowFunction () {
  return timedFunction(10000);
}

function timedFunction (ms) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      resolve('done');
    }, ms);
    if (typeof timer.unref === 'function') {
      timer.unref();
    }
  });
}

function timedFailingFunction (ms) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(`Failed after ${ms}`);
    }, ms);
    if (typeof timer.unref === 'function') {
      timer.unref();
    }
  });
}

function nonPromise () {
  return 'foo';
}

function callbackFunction (x, y, callback) {
  callback(null, x + y);
}

function failedCallbackFunction () {
  Array.prototype.slice.call(arguments).pop()('Whoops!');
}

function identity (_) { return _; }

module.exports = exports = {
  passFail,
  slowFunction,
  timedFunction,
  timedFailingFunction,
  callbackFunction,
  failedCallbackFunction,
  nonPromise,
  identity
};
