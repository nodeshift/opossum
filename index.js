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
 * @param options.rollingCountTimeout Sets the duration of the statistical rolling
 * window, in milliseconds. This is how long Opossum keeps metrics for the circuit
 * breaker to use and for publishing. Default: 10000
 * @param options.rollingCountBuckets Sets the number of buckets the rolling
 * statistical window is divided into. So, if options.rollingCountTimeout is
 * 10000, and options.rollingCountBuckets is 10, then the statistical window will
 * be 1000 1 second snapshots in the statistical window. Default: 10
 * @param options.name the circuit name to use when reporting stats
 * @param options.rollingPercentilesEnabled This property indicates whether
 * execution latencies should be tracked and calculated as percentiles. If they
 * are disabled, all summary statistics (mean, percentiles) are returned as -1.
 * Default: false
 * @param options.capacity the number of concurrent requests allowed. If the number
 * currently executing function calls is equal to options.capacity, further calls
 * to `fire()` are rejected until at least one of the current requests completes.
 * @param options.errorThresholdPercentage the error percentage at which to open the
 * circuit and start short-circuiting requests to fallback.
 * @param options.enabled whether this circuit is enabled upon construction. Default: true
 * @param options.allowWarmUp {boolean} determines whether to allow failures
 * without opening the circuit during a brief warmup period (this is the
 * `rollingCountDuration` property). Default: false
 * allow before enabling the circuit. This can help in situations where no matter
 * what your `errorThresholdPercentage` is, if the first execution times out or
 * fails, the circuit immediately opens. Default: 0
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
