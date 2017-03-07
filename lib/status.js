'use strict';

const CIRCUIT_BREAKER = Symbol('circuit-breaker');

/**
 * @class
 * Tracks execution status for a given {@link CircuitBreaker}
 * @param {CircuitBreaker} circuit the {@link CircuitBreaker} to track status for
 */
class Status {
  constructor (circuit) {
    /**
     * The number of times the breaker's action has failed
     */
    this.failures = 0;
    /**
     * The number of times a fallback function has been executed
     */
    this.fallbacks = 0;
    /**
     * The number of times the action for this breaker executed successfully
     */
    this.successes = 0;
    /**
     * The number of times this breaker been rejected because it was fired, but in the open state.
     */
    this.rejects = 0;
    /**
     * The number of times this circuit breaker has been fired
     */
    this.fires = 0;
    /**
     * The number of times this circuit breaker has timed out
     */
    this.timeouts = 0;
    /**
     * The number of times the cache is used
     */
    this.cacheHit = 0;
    /**
     * The number of times the cache is missed
     */
    this.cacheMiss = 0;
    this[CIRCUIT_BREAKER] = circuit;
    circuit.on('success', () => this.successes++);
    circuit.on('failure', () => this.failures++);
    circuit.on('fallback', () => this.fallbacks++);
    circuit.on('timeout', () => this.timeouts++);
    circuit.on('fire', () => this.fires++);
    circuit.on('reject', () => this.rejects++);
    circuit.on('cacheHit', () => this.cacheHit++);
    circuit.on('cacheMiss', () => this.cacheMiss++);
  }
}

module.exports = exports = Status;
