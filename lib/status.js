'use strict';

const WINDOW = Symbol('window');
const BUCKETS = Symbol('buckets');
const TIMEOUT = Symbol('timeout');

const EventEmitter = require('events').EventEmitter;

/**
 * @class
 * <p>
 * Tracks execution status for a given {@link CircuitBreaker}.
 * A Status instance is created for every {@link CircuitBreaker}
 * and does not typically need to be created by a user.
 * </p>
 * <p>
 * A Status instance will listen for all events on the {@link CircuitBreaker}
 * and track them in a rolling statistical window. The window duration is
 * determined by the `rollingCountTimeout` option provided to the
 * {@link CircuitBreaker}. The window consists of an array of Objects,
 * each representing the counts for a {@link CircuitBreaker}'s events.
 * </p>
 * <p>
 * The array's length is determined by the {@link CircuitBreaker}'s
 * `rollingCountBuckets` option. The duration of each slice of the window
 * is determined by dividing the `rollingCountTimeout` by
 * `rollingCountBuckets`.
 * </p>
 *
 * @example
 * // Creates a 1 second window consisting of ten time slices,
 * // each 100ms long.
 * const circuit = circuitBreaker(fs.readFile,
 *  { rollingCountBuckets: 10, rollingCountTimeout: 1000});
 *
 * // get the cumulative statistics for the last second
 * circuit.status.stats;
 *
 * // get the array of 10, 1 second time slices for the last second
 * circuit.status.window;
 *
 * @see CircuitBreaker#status
 */
class Status extends EventEmitter {
  /**
   * Emitted at each timeslice. Listeners for this
   * event will receive a cumulative snapshot of the current status window.
   * @see Status#stats
   * @event Status#snapshot
   */

  /**
   * Constructs a status object for a given circuit breaker
   * @param {} options
   */
  constructor (options) {
    super();

    // Set up our statistical rolling window
    this[BUCKETS] = options.rollingCountBuckets;
    this[TIMEOUT] = options.rollingCountTimeout;
    this[WINDOW] = new Array(this[BUCKETS]);

    // prime the window with buckets
    for (let i = 0; i < this[BUCKETS]; i++) this[WINDOW][i] = bucket();

    // rotate the buckets periodically
    const bucketInterval = Math.floor(this[TIMEOUT] / this[BUCKETS]);
    let interval = setInterval(nextBucket(this[WINDOW]), bucketInterval);

    // No unref() in the browser
    if (typeof interval.unref === 'function') interval.unref();

    // take snapshots each time the buckets shift
    interval = setInterval(_ => this.emit('snapshot', this.stats),
      bucketInterval);
    if (typeof interval.unref === 'function') interval.unref();
  }

  /**
   * Get the cumulative stats for the current window
   */
  get stats () {
    return this[WINDOW].reduce((acc, val) => {
      // the window starts with all but one bucket undefined
      if (!val) return acc;
      Object.keys(acc).forEach(key => (acc[key] += val[key] || 0));
      return acc;
    }, bucket());
  }

  /**
   * Gets the stats window as an array of time-sliced objects.
   */
  get window () {
    return this[WINDOW].slice();
  }

  increment (property) {
    this[WINDOW][0][property]++;
  }

  open () {
    this[WINDOW][0].isCircuitBreakerOpen = true;
  }

  close () {
    this[WINDOW][0].isCircuitBreakerOpen = false;
  }
}

const nextBucket = window => _ => {
  window.pop();
  window.unshift(bucket());
};

const bucket = _ => ({
  failures: 0,
  fallbacks: 0,
  successes: 0,
  rejects: 0,
  fires: 0,
  timeouts: 0,
  cacheHits: 0,
  cacheMisses: 0
});

module.exports = exports = Status;
