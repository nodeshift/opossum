'use strict';

const CIRCUIT_BREAKER = Symbol('circuit-breaker');
const CIRCUIT_OPEN = Symbol('circuit-open');
const STATS_WINDOW = Symbol('stats-window');
const LISTENERS = Symbol('listeners');
const FIRES = Symbol('fires');
const FAILS = Symbol('fails');

/**
 * @class
 * Tracks execution status for a given {@link CircuitBreaker}
 * @param {CircuitBreaker} circuit the {@link CircuitBreaker} to track status for
 */
class Status {
  constructor (circuit) {
    this[LISTENERS] = new Set();
    this[CIRCUIT_BREAKER] = circuit;
    this[STATS_WINDOW] = [];
    this[FIRES] = 0;
    this[FAILS] = 0;
    this[CIRCUIT_OPEN] = false;

    // Keep total numbers for fires/failures
    circuit.on('fire', () => this[FIRES]++);
    circuit.on('failure', () => this[FAILS]++);

    // Keep track of circuit open state
    circuit.on('open', () => {
      this[CIRCUIT_OPEN] = true;
      this[STATS_WINDOW][0].isCircuitBreakerOpen = true;
    });
    circuit.on('close', () => {
      this[CIRCUIT_OPEN] = false;
      this[STATS_WINDOW][0].isCircuitBreakerOpen = false;
    });

    circuit.on('success', increment(this, 'successes'));
    circuit.on('failure', increment(this, 'failures'));
    circuit.on('fallback', increment(this, 'fallbacks'));
    circuit.on('timeout', increment(this, 'timeouts'));
    circuit.on('fire', increment(this, 'fires'));
    circuit.on('reject', increment(this, 'rejects'));
    circuit.on('cacheHit', increment(this, 'cacheHits'));
    circuit.on('cacheMiss', increment(this, 'cacheMisses'));

    // Set up our statistical rolling window
    const buckets = circuit.options.rollingCountBuckets;
    const timeout = circuit.options.rollingCountTimeout;

    // Add the first bucket to the window
    this[STATS_WINDOW].unshift(stats(this));

    // TODO: do we guard against divide by zero, and for
    // greater accuracy, do we require that timeout be
    // evenly divisible by the number of buckets?
    const bucketInterval = Math.floor(timeout / buckets);
    const interval = setInterval(() => {
      const window = this[STATS_WINDOW];
      if (window.length === buckets) {
        window.pop();
      }
      let next = stats(this);
      next.isCircuitBreakerOpen = this[CIRCUIT_OPEN];
      window.unshift(next);
      for (const listener of this[LISTENERS]) {
        listener.call(listener, window[1]);
      }
    }, bucketInterval);
    if (typeof interval.unref === 'function') interval.unref();
  }

  /**
   * Add a status listener which will be called with the most
   * recently completed snapshot each time a new one is created.
   * @param {any} listener
   */
  addSnapshotListener (listener) {
    this[LISTENERS].add(listener);
  }

  /**
   * Gets the full stats window as an array of objects.
   */
  get window () {
    return this[STATS_WINDOW].slice();
  }

  /**
   * The number of times the action for this breaker executed successfully
   * during the current statistical window.
   */
  get successes () {
    return this[STATS_WINDOW][0].successes;
  }

  /**
   * The number of times the breaker's action has failed
   * during the current statistical window.
   */
  get failures () {
    return this[STATS_WINDOW][0].failures;
  }

  /**
   * The number of times a fallback function has been executed
   * during the current statistical window.
   */
  get fallbacks () {
    return this[STATS_WINDOW][0].fallbacks;
  }

  /**
   * The number of times during the current statistical window that
   * this breaker been rejected because it was in the open state.
   */
  get rejects () {
    return this[STATS_WINDOW][0].rejects;
  }

  /**
   * The number of times this circuit breaker has been fired
   * during the current statistical window.
   */
  get fires () {
    return this[STATS_WINDOW][0].fires;
  }

  /**
   * The number of times this circuit breaker has timed out
   * during the current statistical window.
   */
  get timeouts () {
    return this[STATS_WINDOW][0].timeouts;
  }

  /**
   * The number of times this circuit breaker has retrieved
   * a value from the cache instead. If the circuit does not use
   * caching, then this value will always be 0.
   */
  get cacheHits () {
    return this[STATS_WINDOW][0].cacheHits;
  }

  /**
   * The number of times this circuit breaker has looked in the
   * cache and found nothing. If the circuit does not use caching then
   * this value will always be 0.
   */
  get cacheMisses () {
    return this[STATS_WINDOW][0].cacheMisses;
  }
}

const increment =
  (status, property) => () => status[STATS_WINDOW][0][property]++;

const stats = (circuit) => ({
  isCircuitBreakerOpen: circuit[STATS_WINDOW][0]
                      ? circuit[STATS_WINDOW].isCircuitBreakerOpen : false,
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
