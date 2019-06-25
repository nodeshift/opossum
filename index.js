'use strict';

const CircuitBreaker = require('./lib/circuit');
let lastCircuit;

const defaults = {
  timeout: 10000, // 10 seconds
  errorThresholdPercentage: 50,
  resetTimeout: 30000 // 30 seconds
};

/**
 * Creates a {@link CircuitBreaker} instance capable of executing `action`.
 *
 * @param {Function} action The action to fire for this {@link CircuitBreaker}
 * @param {Object} options Options for the {@link CircuitBreaker}
 * @param {Number} options.timeout The time in milliseconds that action should
 * be allowed to execute before timing out. Default 10000 (10 seconds)
 * @param {Number} options.maxFailures (Deprecated) The number of times the
 * circuit can fail before opening. Default 10.
 * @param {Number} options.resetTimeout The time in milliseconds to wait before
 * setting the breaker to `halfOpen` state, and trying the action again.
 * Default: 30000 (30 seconds)
 * @param {Number} options.rollingCountTimeout Sets the duration of the
 * statistical rolling window, in milliseconds. This is how long Opossum keeps
 * metrics for the circuit breaker to use and for publishing. Default: 10000
 * @param {Number} options.rollingCountBuckets Sets the number of buckets the
 * rolling statistical window is divided into. So, if
 * options.rollingCountTimeout is 10000, and options.rollingCountBuckets is 10,
 * then the statistical window will be 1000 1 second snapshots in the
 * statistical window. Default: 10
 * @param {String} options.name the circuit name to use when reporting stats.
 * Default: the name of the function this circuit controls.
 * @param {boolean} options.rollingPercentilesEnabled This property indicates
 * whether execution latencies should be tracked and calculated as percentiles.
 * If they are disabled, all summary statistics (mean, percentiles) are
 * returned as -1. Default: false
 * @param {Number} options.capacity the number of concurrent requests allowed.
 * If the number currently executing function calls is equal to
 * options.capacity, further calls to `fire()` are rejected until at least one
 * of the current requests completes. Default: `Number.MAX_SAFE_INTEGER`.
 * @param {Number} options.errorThresholdPercentage the error percentage at
 * which to open the circuit and start short-circuiting requests to fallback.
 * Default: 50
 * @param {boolean} options.enabled whether this circuit is enabled upon
 * construction. Default: true
 * @param {boolean} options.allowWarmUp determines whether to allow failures
 * without opening the circuit during a brief warmup period (this is the
 * `rollingCountDuration` property). Default: false
 * allow before enabling the circuit. This can help in situations where no
 * matter what your `errorThresholdPercentage` is, if the first execution
 * times out or fails, the circuit immediately opens. Default: 0
 * @param {Number} options.volumeThreshold the minimum number of requests within
 * the rolling statistical window that must exist before the circuit breaker
 * can open. This is similar to `options.allowWarmUp` in that no matter how many
 * failures there are, if the number of requests within the statistical window
 * does not exceed this threshold, the circuit will remain closed. Default: 0
 * @param {Function} options.errorFilter an optional function that will be
 * called when the circuit's function fails (returns a rejected Promise). If
 * this function returns truthy, the circuit's failure statistics will not be
 * incremented. This is useful, for example, when you don't want HTTP 404 to
 * trip the circuit, but still want to handle it as a failure case.

 * @return {CircuitBreaker} a newly created {@link CircuitBreaker} instance
 */
function factory (action, options) {
  lastCircuit = new CircuitBreaker(action,
    Object.assign({}, defaults, options));
  return lastCircuit;
}

/**
 * Given a function that receives a callback as its last argument,
 * and which executes that function, passing as parameters `err` and `result`,
 * creates an action that returns a promise which resolves when the function's
 * callback is executed.
 * @function factory.promisify
 *
 * @param {Function} action A Node.js-like asynchronous function
 * @example
 *     const fs = require('fs');
 *     const readFilePromised = circuitBreaker.promisify(fs.readFile);
 *     const breaker = circuitBreaker(readFilePromised);
 */
factory.promisify = require('./lib/promisify');

/**
 * Get the Prometheus metrics for all circuits.
 * @function factory.metrics
 * @return {String} the metrics for all circuits or
 * undefined if no circuits have been created
 */
factory.metrics = function metrics() {
  // Just get the metrics for the last circuit that was created
  // since prom-client is additive
  if (lastCircuit && lastCircuit.metrics) return lastCircuit.metrics.metrics;
}

let warningIssued = false;
Object.defineProperty(factory, 'stats', {
  get: _ => {
    if (!warningIssued) {
      warningIssued = true;
      console.warn(`WARNING: Hystrics stats are deprecated
      See: https://github.com/Netflix/Hystrix#dashboard`)
    }
    return require('./lib/hystrix-stats').stream;
  }
});

/**
 * Get an <code>Iterator</code> object containing all
 * circuits that have been created but not subsequently shut down.
 * @function factory.circuits
 * @return {Iterator} an <code>Iterator</code> of all available circuits
 */
factory.circuits = CircuitBreaker.circuits;
  
module.exports = exports = factory;
// Allow use of default import syntax in TypeScript
module.exports.default = factory;
