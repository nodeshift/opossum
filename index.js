'use strict';

const CircuitBreaker = require('./lib/circuit');

const defaults = {
  timeout: 10000, // 10 seconds
  errorThresholdPercentage: 50,
  resetTimeout: 30000 // 30 seconds
};

/**
 * @module opossum
 */

/**
 * Creates a {@link CircuitBreaker} instance capable of executing `action`.
 * @param action {function} The action to fire for this {@link CircuitBreaker}
 * @param options {Object} Options for the {@link CircuitBreaker}
 * @param options.timeout {number} The time in milliseconds that action should
 * be allowed to execute before timing out. Default 10000 (10 seconds)
 * @param options.maxFailures The number of times the circuit can fail before
 * opening. Default 10.
 * @param options.resetTimeout The time in milliseconds to wait before setting
 * the breaker to `halfOpen` state, and trying the action again.
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

circuitBreaker.stats = require('./lib/hystrix-stats').stream;

module.exports = exports = circuitBreaker;
// Allow use of default import syntax in TypeScript
module.exports.default = circuitBreaker;
