'use strict';

const WINDOW = Symbol('window');
const BUCKETS = Symbol('buckets');
const TIMEOUT = Symbol('timeout');
const PERCENTILES = Symbol('percentiles');
const BUCKET_INTERVAL = Symbol('bucket-interval');
const SNAPSHOT_INTERVAL = Symbol('snapshot-interval');

const EventEmitter = require('events').EventEmitter;

/**
 * Tracks execution status for a given {@link CircuitBreaker}.
 * A Status instance is created for every {@link CircuitBreaker}
 * and does not typically need to be created by a user.
 *
 * A Status instance will listen for all events on the {@link CircuitBreaker}
 * and track them in a rolling statistical window. The window duration is
 * determined by the `rollingCountTimeout` option provided to the
 * {@link CircuitBreaker}. The window consists of an array of Objects,
 * each representing the counts for a {@link CircuitBreaker}'s events.
 *
 * The array's length is determined by the {@link CircuitBreaker}'s
 * `rollingCountBuckets` option. The duration of each slice of the window
 * is determined by dividing the `rollingCountTimeout` by
 * `rollingCountBuckets`.
 *
 * @class Status
 * @extends EventEmitter
 * @param {Object} options for the status window
 * @param {Number} options.rollingCountBuckets number of buckets in the window
 * @param {Number} options.rollingCountTimeout the duration of the window
 * @param {Boolean} options.rollingPercentilesEnabled whether to calculate
 * percentiles
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
 * @fires Status#snapshot
 * @see CircuitBreaker#status
 */
class Status extends EventEmitter {
  constructor (options) {
    super();

    // Set up our statistical rolling window
    this[BUCKETS] = options.rollingCountBuckets;
    this[TIMEOUT] = options.rollingCountTimeout;
    this[WINDOW] = new Array(this[BUCKETS]);
    this[PERCENTILES] = [0.0, 0.25, 0.5, 0.75, 0.9, 0.95, 0.99, 0.995, 1];

    // Default this value to true
    this.rollingPercentilesEnabled = options.rollingPercentilesEnabled;

    // prime the window with buckets
    for (let i = 0; i < this[BUCKETS]; i++) this[WINDOW][i] = bucket();

    // rotate the buckets periodically
    const bucketInterval = Math.floor(this[TIMEOUT] / this[BUCKETS]);
    this[BUCKET_INTERVAL] = setInterval(nextBucket(this[WINDOW]),
      bucketInterval);

    // No unref() in the browser
    if (typeof this[BUCKET_INTERVAL].unref === 'function') {
      this[BUCKET_INTERVAL].unref();
    }

    /**
     * Emitted at each time-slice. Listeners for this
     * event will receive a cumulative snapshot of the current status window.
     * @event Status#snapshot
     * @type {Object}
     */
    this[SNAPSHOT_INTERVAL] = setInterval(
      _ => this.emit('snapshot', this.stats),
      bucketInterval);
    if (typeof this[SNAPSHOT_INTERVAL].unref === 'function') {
      this[SNAPSHOT_INTERVAL].unref();
    }
  }

  /**
   * Get the cumulative stats for the current window
   * @type {Object}
   */
  get stats () {
    const totals = this[WINDOW].reduce((acc, val) => {
      if (!val) { return acc; }
      Object.keys(acc).forEach(key => {
        if (key !== 'latencyTimes' && key !== 'percentiles') {
          (acc[key] += val[key] || 0);
        }
      });

      if (this.rollingPercentilesEnabled) {
        acc.latencyTimes.push.apply(acc.latencyTimes, val.latencyTimes || []);
      }
      return acc;
    }, bucket());

    if (this.rollingPercentilesEnabled) {
      // Sort the latencyTimes
      totals.latencyTimes.sort((a, b) => a - b);

      // Get the mean latency
      // Mean = sum of all values in the array/length of array
      if (totals.latencyTimes.length) {
        totals.latencyMean =
          (totals
            .latencyTimes
            .reduce((a, b) => a + b, 0)) / totals.latencyTimes.length;
      } else {
        totals.latencyMean = 0;
      }

      // Calculate Percentiles
      this[PERCENTILES].forEach(percentile => {
        totals.percentiles[percentile] =
          calculatePercentile(percentile, totals.latencyTimes);
      });
    } else {
      totals.latencyMean = -1;
      this[PERCENTILES].forEach(percentile => {
        totals.percentiles[percentile] = -1;
      });
    }

    return totals;
  }

  /**
   * Gets the stats window as an array of time-sliced objects.
   * @type {Array}
   */
  get window () {
    return this[WINDOW].slice();
  }

  increment (property, latencyRunTime) {
    this[WINDOW][0][property]++;
    if (property === 'successes' ||
        property === 'failures' ||
        property === 'timeouts') {
      this[WINDOW][0].latencyTimes.push(latencyRunTime || 0);
    }
  }

  open () {
    this[WINDOW][0].isCircuitBreakerOpen = true;
  }

  close () {
    this[WINDOW][0].isCircuitBreakerOpen = false;
  }

  shutdown () {
    this.removeAllListeners();
    clearInterval(this[BUCKET_INTERVAL]);
    clearInterval(this[SNAPSHOT_INTERVAL]);
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
  cacheMisses: 0,
  semaphoreRejections: 0,
  percentiles: {},
  latencyTimes: []
});

function calculatePercentile (percentile, arr) {
  if (percentile === 0) {
    return arr[0] || 0;
  }
  const idx = Math.ceil(percentile * arr.length);
  return arr[idx - 1] || 0;
}

module.exports = exports = Status;
