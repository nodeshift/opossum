'use strict';

const { FALLBACK_FUNCTION } = require('./symbols');

function handleError (error, circuit, timeout, args, latency, resolve, reject) {
  clearTimeout(timeout);
  fail(circuit, error, args, latency);
  const fb = fallback(circuit, error, args, latency);
  if (fb) resolve(fb);
  else reject(error);
}

function fallback (circuit, err, args) {
  if (circuit[FALLBACK_FUNCTION]) {
    const result =
      circuit[FALLBACK_FUNCTION].apply(circuit[FALLBACK_FUNCTION], args);
    /**
     * Emitted when the circuit breaker executes a fallback function
     * @event CircuitBreaker#fallback
     */
    circuit.emit('fallback', result, err);
    if (result instanceof Promise) return result;
    return Promise.resolve(result);
  }
}

function fail (circuit, err, args, latency) {
  /**
   * Emitted when the circuit breaker action fails
   * @event CircuitBreaker#failure
   */
  circuit.emit('failure', err, latency);

  // check stats to see if the circuit should be opened
  const stats = circuit.stats;
  const errorRate = stats.failures / stats.fires * 100;
  if (errorRate > circuit.options.errorThresholdPercentage ||
    circuit.options.maxFailures >= stats.failures ||
    circuit.halfOpen) {
    circuit.open();
  }
}

// http://stackoverflow.com/a/2117523
const nextName = () =>
  'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });

module.exports = exports = {
  handleError,
  fallback,
  fail,
  nextName
};
