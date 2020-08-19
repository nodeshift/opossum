'use strict';

const EventEmitter = require('events');
const Status = require('./status');
const Semaphore = require('./semaphore');

const STATE = Symbol('state');
const OPEN = Symbol('open');
const CLOSED = Symbol('closed');
const HALF_OPEN = Symbol('half-open');
const PENDING_CLOSE = Symbol('pending-close');
const SHUTDOWN = Symbol('shutdown');
const FALLBACK_FUNCTION = Symbol('fallback');
const STATUS = Symbol('status');
const NAME = Symbol('name');
const GROUP = Symbol('group');
const CACHE = new WeakMap();
const ENABLED = Symbol('Enabled');
const WARMING_UP = Symbol('warming-up');
const VOLUME_THRESHOLD = Symbol('volume-threshold');
const OUR_ERROR = Symbol('our-error');
const RESET_TIMEOUT = Symbol('reset-timeout');
const WARMUP_TIMEOUT = Symbol('warmup-timeout');
const deprecation = `options.maxFailures is deprecated. \
Please use options.errorThresholdPercentage`;

/**
 * Constructs a {@link CircuitBreaker}.
 *
 * @class CircuitBreaker
 * @extends EventEmitter
 * @param {Function} action The action to fire for this {@link CircuitBreaker}
 * @param {Object} options Options for the {@link CircuitBreaker}
 * @param {Number} options.timeout The time in milliseconds that action should
 * be allowed to execute before timing out. Timeout can be disabled by setting
 * this to `false`. Default 10000 (10 seconds)
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
 * `rollingCountTimeout` property). Default: false
 * allow before enabling the circuit. This can help in situations where no
 * matter what your `errorThresholdPercentage` is, if the first execution
 * times out or fails, the circuit immediately opens.
 * @param {Number} options.volumeThreshold the minimum number of requests within
 * the rolling statistical window that must exist before the circuit breaker
 * can open. This is similar to `options.allowWarmUp` in that no matter how many
 * failures there are, if the number of requests within the statistical window
 * does not exceed this threshold, the circuit will remain closed. Default: 0
 * @param {Function} options.errorFilter an optional function that will be
 * called when the circuit's function fails (returns a rejected Promise). If
 * this function returns truthy, the circuit's failPure statistics will not be
 * incremented. This is useful, for example, when you don't want HTTP 404 to
 * trip the circuit, but still want to handle it as a failure case.
 * @param {boolean} options.cache whether the return value of the first
 * successful execution of the circuit's function will be cached. Once a value
 * has been cached that value will be returned for every subsequent execution:
 * the cache can be cleared using `clearCache`. (The metrics `cacheHit` and
 * `cacheMiss` reflect cache activity.) Default: false
 *
 *
 * @fires CircuitBreaker#halfOpen
 * @fires CircuitBreaker#close
 * @fires CircuitBreaker#open
 * @fires CircuitBreaker#fire
 * @fires CircuitBreaker#cacheHit
 * @fires CircuitBreaker#cacheMiss
 * @fires CircuitBreaker#reject
 * @fires CircuitBreaker#timeout
 * @fires CircuitBreaker#success
 * @fires CircuitBreaker#semaphoreLocked
 * @fires CircuitBreaker#healthCheckFailed
 * @fires CircuitBreaker#fallback
 * @fires CircuitBreaker#failure
 */
class CircuitBreaker extends EventEmitter {
  /**
   * Returns true if the provided error was generated here. It will be false
   * if the error came from the action itself.
   * @param {Error} error The Error to check.
   * @returns {Boolean} true if the error was generated here
   */
  static isOurError (error) {
    return !!error[OUR_ERROR];
  }

  constructor (action, options = {}) {
    super();
    this.options = options;
    this.options.timeout =
      options.timeout === false ? false : options.timeout || 10000;
    this.options.resetTimeout = options.resetTimeout || 30000;
    this.options.errorThresholdPercentage =
      options.errorThresholdPercentage || 50;
    this.options.rollingCountTimeout = options.rollingCountTimeout || 10000;
    this.options.rollingCountBuckets = options.rollingCountBuckets || 10;
    this.options.rollingPercentilesEnabled =
      options.rollingPercentilesEnabled !== false;
    this.options.capacity = Number.isInteger(options.capacity)
      ? options.capacity : Number.MAX_SAFE_INTEGER;
    this.options.errorFilter = options.errorFilter || (_ => false);

    this.semaphore = new Semaphore(this.options.capacity);

    this[VOLUME_THRESHOLD] = Number.isInteger(options.volumeThreshold)
      ? options.volumeThreshold : 0;
    this[WARMING_UP] = options.allowWarmUp === true;
    this[STATUS] = new Status(this.options);
    this[STATE] = CLOSED;
    this[FALLBACK_FUNCTION] = null;
    this[PENDING_CLOSE] = false;
    this[NAME] = options.name || action.name || nextName();
    this[GROUP] = options.group || this[NAME];
    this[ENABLED] = options.enabled !== false;

    if (this[WARMING_UP]) {
      const timer = this[WARMUP_TIMEOUT] = setTimeout(
        _ => (this[WARMING_UP] = false),
        this.options.rollingCountTimeout
      );
      if (typeof timer.unref === 'function') {
        timer.unref();
      }
    }

    if (typeof action !== 'function') {
      this.action = _ => Promise.resolve(action);
    } else this.action = action;

    if (options.maxFailures) console.error(deprecation);

    const increment = property =>
      (result, runTime) => this[STATUS].increment(property, runTime);

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
    this.on('semaphoreLocked', increment('semaphoreRejections'));

    /**
     * @param {CircuitBreaker} circuit This current circuit
     * @returns {function(): void} A bound reset callback
     * @private
     */
    function _startTimer (circuit) {
      return _ => {
        const timer = circuit[RESET_TIMEOUT] = setTimeout(() => {
          circuit[STATE] = HALF_OPEN;
          circuit[PENDING_CLOSE] = true;
          /**
           * Emitted after `options.resetTimeout` has elapsed, allowing for
           * a single attempt to call the service again. If that attempt is
           * successful, the circuit will be closed. Otherwise it remains open.
           *
           * @event CircuitBreaker#halfOpen
           * @type {Number} how long the circuit remained open
           */
          circuit.emit('halfOpen', circuit.options.resetTimeout);
        }, circuit.options.resetTimeout);
        if (typeof timer.unref === 'function') {
          timer.unref();
        }
      };
    }

    this.on('open', _startTimer(this));
    this.on('success', _ => {
      if (this.halfOpen) {
        this.close();
      }
    });
    if (this.options.cache) {
      CACHE.set(this, undefined);
    }
  }

  /**
   * Closes the breaker, allowing the action to execute again
   * @fires CircuitBreaker#close
   * @returns {void}
   */
  close () {
    if (this[STATE] !== CLOSED) {
      if (this[RESET_TIMEOUT]) {
        clearTimeout(this[RESET_TIMEOUT]);
      }
      this[STATE] = CLOSED;
      this[PENDING_CLOSE] = false;
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
   *
   * If the breaker is already open this call does nothing.
   * @fires CircuitBreaker#open
   * @returns {void}
   */
  open () {
    if (this[STATE] !== OPEN) {
      this[STATE] = OPEN;
      this[PENDING_CLOSE] = false;
      /**
       * Emitted when the breaker opens because the action has
       * failed more than `options.maxFailures` number of times.
       * @event CircuitBreaker#open
       */
      this.emit('open');
    }
  }

  /**
   * Shuts down this circuit breaker. All subsequent calls to the
   * circuit will fail, returning a rejected promise.
   * @returns {void}
   */
  shutdown () {
    this.disable();
    this.removeAllListeners();
    if (this[RESET_TIMEOUT]) {
      clearTimeout(this[RESET_TIMEOUT]);
    }
    if (this[WARMUP_TIMEOUT]) {
      clearTimeout(this[WARMUP_TIMEOUT]);
    }
    this.status.shutdown();
    this[STATE] = SHUTDOWN;
    /**
     * Emitted when the circuit breaker has been shut down.
     * @event CircuitBreaker#shutdown
     */
    this.emit('shutdown');
  }

  /**
   * Determines if the circuit has been shutdown.
   * @type {Boolean}
   */
  get isShutdown () {
    return this[STATE] === SHUTDOWN;
  }

  /**
   * Gets the name of this circuit
   * @type {String}
   */
  get name () {
    return this[NAME];
  }

  /**
   * Gets the name of this circuit group
   * @type {String}
   */
  get group () {
    return this[GROUP];
  }

  /**
   * Gets whether this circuit is in the `pendingClosed` state
   * @type {Boolean}
   */
  get pendingClose () {
    return this[PENDING_CLOSE];
  }

  /**
   * True if the circuit is currently closed. False otherwise.
   * @type {Boolean}
   */
  get closed () {
    return this[STATE] === CLOSED;
  }

  /**
   * True if the circuit is currently opened. False otherwise.
   * @type {Boolean}
   */
  get opened () {
    return this[STATE] === OPEN;
  }

  /**
   * True if the circuit is currently half opened. False otherwise.
   * @type {Boolean}
   */
  get halfOpen () {
    return this[STATE] === HALF_OPEN;
  }

  /**
   * The current {@link Status} of this {@link CircuitBreaker}
   * @type {Status}
   */
  get status () {
    return this[STATUS];
  }

  /**
   * Get the current stats for the circuit.
   * @see Status#stats
   * @type {Object}
   */
  get stats () {
    return this[STATUS].stats;
  }

  /**
   * Gets whether the circuit is enabled or not
   * @type {Boolean}
   */
  get enabled () {
    return this[ENABLED];
  }

  /**
   * Gets whether the circuit is currently in warm up phase
   * @type {Boolean}
   */
  get warmUp () {
    return this[WARMING_UP];
  }

  /**
   * Gets the volume threshold for this circuit
   * @type {Boolean}
   */
  get volumeThreshold () {
    return this[VOLUME_THRESHOLD];
  }

  /**
   * Provide a fallback function for this {@link CircuitBreaker}. This
   * function will be executed when the circuit is `fire`d and fails.
   * It will always be preceded by a `failure` event, and `breaker.fire` returns
   * a rejected Promise.
   * @param {Function | CircuitBreaker} func the fallback function to execute
   * when the breaker has opened or when a timeout or error occurs.
   * @return {CircuitBreaker} this
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
   * resolve with the resolved value from action. If a fallback function was
   * provided, it will be invoked in the event of any failure or timeout.
   *
   * Any parameters passed to this function will be proxied to the circuit
   * function.
   *
   * @return {Promise<any>} promise resolves with the circuit function's return
   * value on success or is rejected on failure of the action. Use isOurError()
   * to determine if a rejection was a result of the circuit breaker or the
   * action.
   *
   * @fires CircuitBreaker#failure
   * @fires CircuitBreaker#fallback
   * @fires CircuitBreaker#fire
   * @fires CircuitBreaker#reject
   * @fires CircuitBreaker#success
   * @fires CircuitBreaker#timeout
   * @fires CircuitBreaker#semaphoreLocked
   */
  fire (...args) {
    return this.call.apply(this, [this.action].concat(args));
  }

  /**
   * Execute the action for this circuit using `context` as `this`.
   * If the action fails or times out, the
   * returned promise will be rejected. If the action succeeds, the promise will
   * resolve with the resolved value from action. If a fallback function was
   * provided, it will be invoked in the event of any failure or timeout.
   *
   * Any parameters in addition to `context will be passed to the
   * circuit function.
   *
   * @param {any} context the `this` context used for function execution
   * @param {any} rest the arguments passed to the action
   *
   * @return {Promise<any>} promise resolves with the circuit function's return
   * value on success or is rejected on failure of the action.
   *
   * @fires CircuitBreaker#failure
   * @fires CircuitBreaker#fallback
   * @fires CircuitBreaker#fire
   * @fires CircuitBreaker#reject
   * @fires CircuitBreaker#success
   * @fires CircuitBreaker#timeout
   * @fires CircuitBreaker#semaphoreLocked
   */
  call (context, ...rest) {
    if (this.isShutdown) {
      const err = buildError('The circuit has been shutdown.', 'ESHUTDOWN');
      return Promise.reject(err);
    }
    const args = Array.prototype.slice.call(rest);

    /**
     * Emitted when the circuit breaker action is executed
     * @event CircuitBreaker#fire
     * @type {any} the arguments passed to the fired function
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

    if (!this[ENABLED]) {
      const result = this.action.apply(context, args);
      return (typeof result.then === 'function')
        ? result
        : Promise.resolve(result);
    }

    if (!this.closed && !this.pendingClose) {
      /**
       * Emitted when the circuit breaker is open and failing fast
       * @event CircuitBreaker#reject
       * @type {Error}
       */
      const error = buildError('Breaker is open', 'EOPENBREAKER');

      this.emit('reject', error);

      return fallback(this, error, args) ||
        Promise.reject(error);
    }
    this[PENDING_CLOSE] = false;

    let timeout;
    let timeoutError = false;
    return new Promise((resolve, reject) => {
      const latencyStartTime = Date.now();
      if (this.semaphore.test()) {
        if (this.options.timeout) {
          timeout = setTimeout(
            () => {
              timeoutError = true;
              const error = buildError(
                `Timed out after ${this.options.timeout}ms`, 'ETIMEDOUT'
              );
              const latency = Date.now() - latencyStartTime;
              this.semaphore.release();
              /**
               * Emitted when the circuit breaker action takes longer than
               * `options.timeout`
               * @event CircuitBreaker#timeout
               * @type {Error}
               */
              this.emit('timeout', error, latency, args);
              handleError(error, this, timeout, args, latency, resolve, reject);
            }, this.options.timeout);
        }

        try {
          const result = this.action.apply(context, args);
          const promise = (typeof result.then === 'function')
            ? result
            : Promise.resolve(result);

          promise.then(result => {
            if (!timeoutError) {
              clearTimeout(timeout);
              /**
               * Emitted when the circuit breaker action succeeds
               * @event CircuitBreaker#success
               * @type {any} the return value from the circuit
               */
              this.emit('success', result, (Date.now() - latencyStartTime));
              this.semaphore.release();
              resolve(result);
              if (this.options.cache) {
                CACHE.set(this, promise);
              }
            }
          })
            .catch(error => {
              if (!timeoutError) {
                this.semaphore.release();
                const latencyEndTime = Date.now() - latencyStartTime;
                handleError(
                  error, this, timeout, args, latencyEndTime, resolve, reject);
              }
            });
        } catch (error) {
          this.semaphore.release();
          const latency = Date.now() - latencyStartTime;
          handleError(error, this, timeout, args, latency, resolve, reject);
        }
      } else {
        const latency = Date.now() - latencyStartTime;
        const err = buildError('Semaphore locked', 'ESEMLOCKED');
        /**
         * Emitted when the rate limit has been reached and there
         * are no more locks to be obtained.
         * @event CircuitBreaker#semaphoreLocked
         * @type {Error}
         */
        this.emit('semaphoreLocked', err, latency);
        handleError(err, this, timeout, args, latency, resolve, reject);
      }
    });
  }

  /**
   * Clears the cache of this {@link CircuitBreaker}
   * @returns {void}
   */
  clearCache () {
    CACHE.set(this, undefined);
  }

  /**
   * Provide a health check function to be called periodically. The function
   * should return a Promise. If the promise is rejected the circuit will open.
   * This is in addition to the existing circuit behavior as defined by
   * `options.errorThresholdPercentage` in the constructor. For example, if the
   * health check function provided here always returns a resolved promise, the
   * circuit can still trip and open if there are failures exceeding the
   * configured threshold. The health check function is executed within the
   * circuit breaker's execution context, so `this` within the function is the
   * circuit breaker itself.
   *
   * @param {Function} func a health check function which returns a promise.
   * @param {Number} [interval] the amount of time between calls to the health
   * check function. Default: 5000 (5 seconds)
   *
   * @returns {void}
   *
   * @fires CircuitBreaker#healthCheckFailed
   * @throws {TypeError} if `interval` is supplied but not a number
   */
  healthCheck (func, interval) {
    interval = interval || 5000;
    if (typeof func !== 'function') {
      throw new TypeError('Health check function must be a function');
    }
    if (isNaN(interval)) {
      throw new TypeError('Health check interval must be a number');
    }

    const check = _ => {
      func.apply(this).catch(e => {
        /**
         * Emitted with the user-supplied health check function
         * returns a rejected promise.
         * @event CircuitBreaker#healthCheckFailed
         * @type {Error}
         */
        this.emit('healthCheckFailed', e);
        this.open();
      });
    };

    const timer = setInterval(check, interval);
    if (typeof timer.unref === 'function') {
      timer.unref();
    }

    check();
  }

  /**
   * Enables this circuit. If the circuit is the  disabled
   * state, it will be re-enabled. If not, this is essentially
   * a noop.
   * @returns {void}
   */
  enable () {
    this[ENABLED] = true;
  }

  /**
   * Disables this circuit, causing all calls to the circuit's function
   * to be executed without circuit or fallback protection.
   * @returns {void}
   */
  disable () {
    this[ENABLED] = false;
  }
}

function handleError (error, circuit, timeout, args, latency, resolve, reject) {
  clearTimeout(timeout);

  if (circuit.options.errorFilter(error)) {
    circuit.emit('success', error, latency);
  } else {
    fail(circuit, error, args, latency);
  }

  const fb = fallback(circuit, error, args);
  if (fb) resolve(fb);
  else reject(error);
}

function fallback (circuit, err, args) {
  if (circuit[FALLBACK_FUNCTION]) {
    const result =
      circuit[FALLBACK_FUNCTION]
        .apply(circuit[FALLBACK_FUNCTION], [...args, err]);
    /**
     * Emitted when the circuit breaker executes a fallback function
     * @event CircuitBreaker#fallback
     * @type {any} the return value of the fallback function
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
   * @type {Error}
   */
  circuit.emit('failure', err, latency, args);
  if (circuit.warmUp) return;

  // check stats to see if the circuit should be opened
  const stats = circuit.stats;
  if ((stats.fires < circuit.volumeThreshold) && !circuit.halfOpen) return;
  const errorRate = stats.failures / stats.fires * 100;
  if (errorRate > circuit.options.errorThresholdPercentage ||
    stats.failures >= circuit.options.maxFailures ||
    circuit.halfOpen) {
    circuit.open();
  }
}

function buildError (msg, code) {
  const error = new Error(msg);
  error.code = code;
  error[OUR_ERROR] = true;
  return error;
}

// http://stackoverflow.com/a/2117523
const nextName = () =>
  'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });

module.exports = exports = CircuitBreaker;
