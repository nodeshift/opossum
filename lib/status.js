'use strict';

const CIRCUIT_BREAKER = Symbol('circuit-breaker');

/**
 * @class
 * Tracks execution status for a given {@link CircuitBreaker}
 * @param {CircuitBreaker} circuit the {@link CircuitBreaker} to track status for
 */
class Status {
  constructor (circuit) {
    reset(this);
    this[CIRCUIT_BREAKER] = circuit;
    circuit.on('success', () => this.successes++);
    circuit.on('failure', () => this.failures++);
    circuit.on('fallback', () => this.fallbacks++);
    circuit.on('timeout', () => this.timeouts++);
    circuit.on('fire', () => this.fires++);
    circuit.on('reject', () => this.rejects++);
    circuit.on('cacheHits', () => this.cacheHits++);
    circuit.on('cacheMisses', () => this.cacheMisses++);
    const interval = setInterval(
      () => reset(this), circuit.options.rollingCountTimeout);
    if (typeof interval.unref === 'function') interval.unref();
  }
}

function reset (status) {
  /**
   * The number of times the breaker's action has failed
   */
  status.failures = 0;
  /**
   * The number of times a fallback function has been executed
   */
  status.fallbacks = 0;
  /**
   * The number of times the action for this breaker executed successfully
   */
  status.successes = 0;
  /**
   * The number of times this breaker been rejected because it was fired, but in the open state.
   */
  status.rejects = 0;
  /**
   * The number of times this circuit breaker has been fired
   */
  status.fires = 0;
  /**
   * The number of times this circuit breaker has timed out
   */
  status.timeouts = 0;
  /**
   * The number of the cache hits
   */
  status.cacheHits = 0;
  /**
   * The number of the cache misses
   */
  status.cacheMisses = 0;
}

module.exports = exports = Status;
