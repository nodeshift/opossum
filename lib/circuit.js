'use strict';

const EventEmitter = require('events');
const Status = require('./status');
const HystrixStats = require('./hystrix-stats');
const Semaphore = require('await-semaphore').Semaphore;

const STATE = Symbol('state');
const OPEN = Symbol('open');
const CLOSED = Symbol('closed');
const HALF_OPEN = Symbol('half-open');
const PENDING_CLOSE = Symbol('pending-close');
const FALLBACK_FUNCTION = Symbol('fallback');
const STATUS = Symbol('status');
const NAME = Symbol('name');
const GROUP = Symbol('group');
const HYSTRIX_STATS = Symbol('hystrix-stats');
const CACHE = new WeakMap();

/**
 * Constructs a {@link CircuitBreaker}.
 *
 * @class CircuitBreaker
 * @extends EventEmitter
 * @param action {function} The action to fire for this {@link CircuitBreaker} instance
 * @param options {Object} Options for the {@link CircuitBreaker}.
 * There are **no default options** when you use the contructor directly. You
 * must supply values for each of these.
 * @param options.timeout {number} The time in milliseconds that action should
 * be allowed to execute before timing out.
 * @param options.maxFailures The number of times the circuit can fail before
 * opening.
 * @param options.resetTimeout The time in milliseconds to wait before setting
 * the breaker to `halfOpen` state, and trying the action again.
 * @param options.rollingCountTimeout Sets the duration of the statistical
 *  rolling window, in milliseconds. This is how long Opossum keeps metrics for
 *  the circuit breaker to use and for publishing. Default: 10000
 * @param options.rollingCountBuckets sets the number of buckets the rolling
 *  statistical window is divided into. So, if options.rollingCountTimeout is
 *  10000, and options.rollingCountBuckets is 10, then the statistical window
 *  will be 1000 1 second snapshots in the statistical window. Default: 10
 * @param options.name the name to use for this circuit when reporting stats
 * @param options.rollingPercentilesEnabled {boolean} This property indicates whether execution latencies
 *  should be tracked and calculated as percentiles.
 *  If they are disabled, all summary statistics (mean, percentiles) are returned as -1.
 */
class CircuitBreaker extends EventEmitter {
  constructor (action, options) {
    super();
    this.options = options;
    this.options.rollingCountTimeout = options.rollingCountTimeout || 10000;
    this.options.rollingCountBuckets = options.rollingCountBuckets || 10;
    this.options.rollingPercentilesEnabled = options.rollingPercentilesEnabled !== false;
    this.options.capacity = options.capacity || 10;
    this.semaphore = new Semaphore(this.options.capacity);

    this[STATUS] = new Status(this.options);
    this[STATE] = CLOSED;
    this[FALLBACK_FUNCTION] = null;
    this[PENDING_CLOSE] = false;
    this[NAME] = options.name || action.name || nextName();
    this[GROUP] = options.group || this[NAME];

    if (typeof action !== 'function') {
      this.action = _ => Promise.resolve(action);
    } else this.action = action;

    if (options.maxFailures) console.error('options.maxFailures is deprecated. Please use options.errorThresholdPercentage');

    const increment = property => (result, runTime) => this[STATUS].increment(property, runTime);

    this.on('success', increment('successes'));
    this.on('failure', increment('failures'));
    this.on('fallback', increment('fallbacks'));
    this.on('timeout', increment('timeouts'));
    this.on('fire', increment('fires'));
    this.on('reject', increment('rejects'));
    this.on('cacheHit', increment('cacheHits'));
    this.on('cacheMiss', increment('cacheMisses'));
    this.on('open', _ => this[STATUS].open());
    this.on('close', _ => this[STATUS].close());

    /**
     * Emitted after `options.resetTimeout` has elapsed, allowing for
     * a single attempt to call the service again. If that attempt is
     * successful, the circuit will be closed. Otherwise it remains open.
     * @event CircuitBreaker#halfOpen
     */
    function _startTimer (circuit) {
      return _ => {
        const timer = setTimeout(() => {
          circuit[STATE] = HALF_OPEN;
          circuit[PENDING_CLOSE] = true;
          circuit.emit('halfOpen', circuit.options.resetTimeout);
        }, circuit.options.resetTimeout);
        if (typeof timer.unref === 'function') {
          timer.unref();
        }
      };
    }

    this.on('open', _startTimer(this));
    this.on('success', _ => this.close());
    if (this.options.cache) {
      CACHE.set(this, undefined);
    }

    // Register this instance of the circuit breaker with the hystrix stats listener
    this[HYSTRIX_STATS] = new HystrixStats(this);
  }

  /**
   * Closes the breaker, allowing the action to execute again
   * @fires CircuitBreaker#close
   */
  close () {
    this[PENDING_CLOSE] = false;
    if (this[STATE] !== CLOSED) {
      this[STATE] = CLOSED;
      /**
       * Emitted when the breaker is reset allowing the action to execute again
       * @event CircuitBreaker#close
       */
      this.emit('close');
    }
  }

  /**
   * Opens the breaker. Each time the breaker is fired while the circuit is
   * opened, a failed Promise is returned, or if any fallback function
   * has been provided, it is invoked.
   * @fires CircuitBreaker#open
   */
  open () {
    this[PENDING_CLOSE] = false;
    if (this[STATE] !== OPEN) {
      this[STATE] = OPEN;
      /**
       * Emitted when the breaker opens because the action has
       * failed more than `options.maxFailures` number of times.
       * @event CircuitBreaker#open
       */
      this.emit('open');
    }
  }

  /**
   * Gets the name of this circuit
   */
  get name () {
    return this[NAME];
  }

  get group () {
    return this[GROUP];
  }

  get pendingClose () {
    return this[PENDING_CLOSE];
  }

  /**
   * True if the circuit is currently closed. False otherwise.
   */
  get closed () {
    return this[STATE] === CLOSED;
  }

  /**
   * True if the circuit is currently opened. False otherwise.
   */
  get opened () {
    return this[STATE] === OPEN;
  }

  /**
   * True if the circuit is currently half opened. False otherwise.
   */
  get halfOpen () {
    return this[STATE] === HALF_OPEN;
  }

  /**
   * The current {@link Status} of this {@link CircuitBreaker}
   */
  get status () {
    return this[STATUS];
  }

  /**
   * A convenience function that returns the current stats for the circuit.
   * @see Status#stats
   */
  get stats () {
    return this[STATUS].stats;
  }

  /**
    A convenience function that returns the hystrixStats
  */
  get hystrixStats () {
    return this[HYSTRIX_STATS];
  }
  /**
   * Provide a fallback function for this {@link CircuitBreaker}. This
   * function will be executed when the circuit is `fire`d and fails.
   * It will always be preceded by a `failure` event, and `breaker.fire` returns
   * a rejected Promise.
   * @param func {Function | CircuitBreaker} the fallback function to execute when the breaker
   * has opened or when a timeout or error occurs.
   * @return {@link CircuitBreaker} this
   */
  fallback (func) {
    let fb = func;
    if (func instanceof CircuitBreaker) {
      fb = function () {
        return func.fire.apply(func, arguments);
      };
    }
    this[FALLBACK_FUNCTION] = fb;
    return this;
  }

  /**
   * Execute the action for this circuit. If the action fails or times out, the
   * returned promise will be rejected. If the action succeeds, the promise will
   * resolve with the resolved value from action. If a fallback function has been
   * provided, it will be invoked in the event of any failure or timeout.
   *
   * @return {@link Promise} a Promise that resolves on success and is rejected
   * on failure of the action.
   *
   * @fires CircuitBreaker#failure
   * @fires CircuitBreaker#fallback
   * @fires CircuitBreaker#fire
   * @fires CircuitBreaker#reject
   * @fires CircuitBreaker#success
   * @fires CircuitBreaker#timeout
   */
  fire () {
    const args = Array.prototype.slice.call(arguments);

    /**
     * Emitted when the circuit breaker action is executed
     * @event CircuitBreaker#fire
     */
    this.emit('fire', args);

    if (CACHE.get(this) !== undefined) {
      /**
       * Emitted when the circuit breaker is using the cache
       * and finds a value.
       * @event CircuitBreaker#cacheHit
       */
      this.emit('cacheHit');
      return CACHE.get(this);
    } else if (this.options.cache) {
      /**
       * Emitted when the circuit breaker does not find a value in
       * the cache, but the cache option is enabled.
       * @event CircuitBreaker#cacheMiss
       */
      this.emit('cacheMiss');
    }

    if (this.opened && !this.pendingClose) {
      /**
       * Emitted when the circuit breaker is open and failing fast
       * @event CircuitBreaker#reject
       */
      this.emit('reject', new Error('Breaker is open'));

      return fallback(this, 'Breaker is open', args, 0) ||
        Promise.reject(new Error('Breaker is open'));
    }
    this[PENDING_CLOSE] = false;

    let timeout;
    let timeoutError = false;
    return this.semaphore.acquire().then((release) => {
      return new Promise((resolve, reject) => {
        const latencyStartTime = Date.now();
        timeout = setTimeout(
          () => {
            timeoutError = true;
            const error = new Error(`Timed out after ${this.options.timeout}ms`);
            error.code = 'ETIMEDOUT';
            /**
             * Emitted when the circuit breaker action takes longer than `options.timeout`
             * @event CircuitBreaker#timeout
             */
            const latency = Date.now() - latencyStartTime;
            release();
            this.emit('timeout', error, latency);
            resolve(handleError(error, this, timeout, args, latency, resolve, reject));
          }, this.options.timeout);

        try {
          const result = this.action.apply(this.action, args);
          const promise = (typeof result.then === 'function')
            ? result
            : Promise.resolve(result);

          promise.then((result) => {
            if (!timeoutError) {
              clearTimeout(timeout);
              /**
               * Emitted when the circuit breaker action succeeds
               * @event CircuitBreaker#success
               */
              this.emit('success', result, (Date.now() - latencyStartTime));
              release();
              resolve(result);
              if (this.options.cache) {
                CACHE.set(this, promise);
              }
            }
          })
          .catch((error) => {
            release();
            const latencyEndTime = Date.now() - latencyStartTime;
            handleError(error, this, timeout, args, latencyEndTime, resolve, reject);
          });
        } catch (error) {
          release();
          const latency = Date.now() - latencyStartTime;
          handleError(error, this, timeout, args, latency, resolve, reject);
        }
      });
    });
  }

  /**
   * Clears the cache of this {@link CircuitBreaker}
   */
  clearCache () {
    CACHE.set(this, undefined);
  }
}

function handleError (error, circuit, timeout, args, latency, resolve, reject) {
  clearTimeout(timeout);
  fail(circuit, error, args, latency);
  const fb = fallback(circuit, error, args, latency);
  if (fb) resolve(fb);
  else reject(error);
}

function fallback (circuit, err, args) {
  if (circuit[FALLBACK_FUNCTION]) {
    return new Promise((resolve, reject) => {
      const result = circuit[FALLBACK_FUNCTION].apply(circuit[FALLBACK_FUNCTION], args);
      /**
       * Emitted when the circuit breaker executes a fallback function
       * @event CircuitBreaker#fallback
       */
      circuit.emit('fallback', result, err);
      resolve(result);
    });
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
    circuit.options.maxFailures >= stats.failures) {
    circuit.open();
  }
}

// http://stackoverflow.com/a/2117523
const nextName = () =>
  'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });

module.exports = exports = CircuitBreaker;
