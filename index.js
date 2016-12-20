'use strict';

const CircuitBreaker = require('./lib/circuit');
const Fidelity = require('fidelity');

const defaults = {
  timeout: 10000, // 10 seconds
  maxFailures: 10,
  resetTimeout: 30000, // 30 seconds
  Promise: Fidelity
};

/** Detect free variable `global` from Node.js. */
const freeGlobal = typeof global === 'object' && global && global.Object === Object && global;

/* eslint no-new-func: 0 */
/** Used as a reference to the global object. */
const root = freeGlobal || Function('return this')();

/**
 * @module opossum
 */

/**
 * Creates a {@link CircuitBreaker} instance capable of executing `action`.
 * @param action {function} The action to fire for this {@link CircuitBreaker} instance
 * @param options {Object} Options for the {@link CircuitBreaker}
 * @param options.timeout {number} The time in milliseconds that action should
 * be allowed to execute before timing out. Default 10000 (10 seconds)
 * @param options.maxFailures The number of times the circuit can fail before
 * opening. Default 10.
 * @param options.resetTimeout The time in milliseconds to wait before setting
 * the breaker to `halfOpen` state, and trying the action again.
 * @param options.Promise {Promise} Opossum uses Fidelity promises, but works
 * fine with any Promise that follows the spec. You can specify your favored
 * implementation by providing the constructor as an option.
 * @return a {@link CircuitBreaker} instance
 */
function circuitBreaker (action, options) {
  return new CircuitBreaker(action, Object.assign({}, defaults, options));
}

/**
 * Given a function that receives a callback as its last argument,
 * and which executes that function, passing as parameters `err` and `result`,
 * creates an action that returns a promise which resolves when the function's
 * callback is executed.
 * @function promisify
 *
 * @param action {function} A Node.js-like asynchronous function
 * @return The `action` wrapped in a promise API.
 * @example
 *     const fs = require('fs');
 *     const readFilePromised = circuitBreaker.promisify(fs.readFile);
 *     const breaker = circuitBreaker(readFilePromised);
 */
circuitBreaker.promisify = require('./lib/promisify');

function exportModule (exported) {
  console.log('Exporting', exported);
  console.log('Module', module);
  if (typeof document === 'object') {
    // in a browser environment
    root[exported.name] = exported;
  } else if (typeof module === 'object' && module.exports) {
    // we're in a node.js environment
    module.exports = exports = exported;
  } else {
    // ??
    root[exported.name] = exported;
  }
}

exportModule(circuitBreaker);
