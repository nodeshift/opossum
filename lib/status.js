'use strict';

const CIRCUIT_BREAKER = Symbol('circuit-breaker');
const STATS_WINDOW = Symbol('stats-window');

/**
 * @class
 * Tracks execution status for a given {@link CircuitBreaker}
 * @param {CircuitBreaker} circuit the {@link CircuitBreaker} to track status for
 */
class Status {
  constructor (circuit) {
    this[CIRCUIT_BREAKER] = circuit;
    this[STATS_WINDOW] = [];

    function increment (status, property) {
      return () => status[STATS_WINDOW][0][property]++;
    }

    circuit.on('success', increment(this, 'successes'));
    circuit.on('failure', increment(this, 'failures'));
    circuit.on('fallback', increment(this, 'fallbacks'));
    circuit.on('timeout', increment(this, 'timeouts'));
    circuit.on('fire', increment(this, 'fires'));
    circuit.on('reject', increment(this, 'rejects'));
    circuit.on('cacheHits', increment(this, 'cacheHits'));
    circuit.on('cacheMisses', increment(this, 'cacheMisses'));

    // Set up our statistical rolling window
    const buckets = circuit.options.rollingCountBuckets;
    const timeout = circuit.options.rollingCountTimeout;

    // Add the first bucket to the window
    this[STATS_WINDOW].unshift(stats());

    // TODO: do we guard against divide by zero, and for
    // greater accuracy, do we require that timeout be
    // evenly divisible by the number of buckets?
    const bucketInterval = Math.floor(timeout / buckets);
    const interval = setInterval(() => {
      if (this[STATS_WINDOW].length === buckets) {
        this[STATS_WINDOW].pop();
      }
      this[STATS_WINDOW].unshift(stats());
    }, bucketInterval);
    if (typeof interval.unref === 'function') interval.unref();
  }

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

const stats = () => ({
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
