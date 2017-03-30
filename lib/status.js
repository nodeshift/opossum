'use strict';

const CIRCUIT_OPEN = Symbol('circuit-open');
const WINDOW = Symbol('window');
const BUCKETS = Symbol('buckets');
const TIMEOUT = Symbol('timeout');
const FIRES = Symbol('fires');
const FAILS = Symbol('fails');

const EventEmitter = require('events').EventEmitter;

/**
 * @class
 * Tracks execution status for a given {@link CircuitBreaker}
 * @param {CircuitBreaker} circuit the {@link CircuitBreaker} to track status for
 */
class Status extends EventEmitter {
  constructor (circuit) {
    super();
    this[FIRES] = 0;
    this[FAILS] = 0;
    this[CIRCUIT_OPEN] = false;

    // Set up our statistical rolling window
    this[BUCKETS] = circuit.options.rollingCountBuckets;
    this[TIMEOUT] = circuit.options.rollingCountTimeout;
    this[WINDOW] = new Array(this[BUCKETS]);
    this.snapshot(); // take the first snapshot

    const interval = setInterval(this.snapshot.bind(this),
      Math.floor(this[TIMEOUT] / this[BUCKETS]));

    // No unref() in the browser
    if (typeof interval.unref === 'function') interval.unref();

    // Keep total numbers for fires/failures
    circuit.on('fire', () => this[FIRES]++);
    circuit.on('failure', () => this[FAILS]++);

    // Keep track of circuit open state
    circuit.on('open', () => {
      this[CIRCUIT_OPEN] = true;
      this[WINDOW][0].isCircuitBreakerOpen = true;
    });

    circuit.on('close', () => {
      this[CIRCUIT_OPEN] = false;
      this[WINDOW][0].isCircuitBreakerOpen = false;
    });

    circuit.on('success', increment(this, 'successes'));
    circuit.on('failure', increment(this, 'failures'));
    circuit.on('fallback', increment(this, 'fallbacks'));
    circuit.on('timeout', increment(this, 'timeouts'));
    circuit.on('fire', increment(this, 'fires'));
    circuit.on('reject', increment(this, 'rejects'));
    circuit.on('cacheHit', increment(this, 'cacheHits'));
    circuit.on('cacheMiss', increment(this, 'cacheMisses'));
  }

  snapshot () {
    this[WINDOW].pop();
    let next = stats(this);

    this[WINDOW].unshift(next);
    /**
     * @emits 'snapshot' when a new status snapshot is taken
     */
    this.emit('snapshot', next);
    return next;
  }

  /**
   * Gets the full stats window as an array of objects.
   */
  get window () {
    return this[WINDOW].slice();
  }

  /**
   * The number of times the action for this breaker executed successfully
   * during the current statistical window.
   */
  get successes () {
    return this[WINDOW][0].successes;
  }

  /**
   * The number of times the breaker's action has failed
   */
  get failures () {
    return this[FAILS];
  }

  /**
   * The number of times a fallback function has been executed
   * during the current statistical window.
   */
  get fallbacks () {
    return this[WINDOW][0].fallbacks;
  }

  /**
   * The number of times during the current statistical window that
   * this breaker been rejected because it was in the open state.
   */
  get rejects () {
    return this[WINDOW][0].rejects;
  }

  /**
   * The total number of times this circuit breaker has been fired
   */
  get fires () {
    return this[FIRES];
  }

  /**
   * The number of times this circuit breaker has timed out
   * during the current statistical window.
   */
  get timeouts () {
    return this[WINDOW][0].timeouts;
  }

  /**
   * The number of times this circuit breaker has retrieved
   * a value from the cache instead. If the circuit does not use
   * caching, then this value will always be 0.
   */
  get cacheHits () {
    return this[WINDOW][0].cacheHits;
  }

  /**
   * The number of times this circuit breaker has looked in the
   * cache and found nothing. If the circuit does not use caching then
   * this value will always be 0.
   */
  get cacheMisses () {
    return this[WINDOW][0].cacheMisses;
  }
}

const increment =
  (status, property) => () => {
    status[WINDOW][0][property]++;
  };

const stats = circuit => ({
  isCircuitBreakerOpen: circuit[CIRCUIT_OPEN],
  failures: 0,
  fallbacks: 0,
  successes: 0,
  rejects: 0,
  fires: 0,
  timeouts: 0,
  cacheHits: 0,
  cacheMisses: 0,
  start: Date.now()
});

module.exports = exports = Status;
