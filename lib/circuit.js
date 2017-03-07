'use strict';

const EventEmitter = require('events');
const Status = require('./status');

const STATE = Symbol('state');
const OPEN = Symbol('open');
const CLOSED = Symbol('closed');
const HALF_OPEN = Symbol('half-open');
const PENDING_CLOSE = Symbol('pending-close');
const FALLBACK_FUNCTION = Symbol('fallback');
const NUM_FAILURES = Symbol('num-failures');
const STATUS = Symbol('status');
const CACHE = new WeakMap();

/**
 * @class CircuitBreaker
 * @extends EventEmitter
 * Constructs a {@link CircuitBreaker}.
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
 * @fires CircuitBreaker#halfOpen
 */
class CircuitBreaker extends EventEmitter {
  constructor (action, options) {
    super();
    this.options = options;
    this.Promise = options.Promise;
    this[STATUS] = new Status(this);
    this[STATE] = CLOSED;
    this[FALLBACK_FUNCTION] = null;
    this[PENDING_CLOSE] = false;
    this[NUM_FAILURES] = 0;

    if (typeof action !== 'function') this.action = () => this.Promise.resolve(action);
    else this.action = action;

    /**
     * Emitted after `options.resetTimeout` has elapsed, allowing for
     * a single attempt to call the service again. If that attempt is
     * successful, the circuit will be closed. Otherwise it remains open.
     * @event CircuitBreaker#halfOpen
     */
    function _startTimer (circuit) {
      return () => {
        const timer = setTimeout(() => {
          circuit[STATE] = HALF_OPEN;
          circuit.emit('halfOpen', circuit.options.resetTimeout);
        }, circuit.options.resetTimeout);
        if (typeof timer.unref === 'function') {
          timer.unref();
        }
      };
    }

    this.on('open', _startTimer(this));
    this.on('success', () => this.close());
    if (this.options.cache) {
      CACHE.set(this, undefined);
    }
  }

  /**
   * Closes the breaker, allowing the action to execute again
   * @fires CircuitBreaker#close
   */
  close () {
    this[NUM_FAILURES] = 0;
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
   * opened, a failed Promise is returned, and any fallback function
   * that has been provided is invoked.
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
    if (CACHE.get(this) !== undefined) {
      this.emit('cacheHit');
      return CACHE.get(this);
    } else {
      this.emit('cacheMiss');
    }
    const args = Array.prototype.slice.call(arguments);
    /**
     * Emitted when the circuit breaker action is executed
     * @event CircuitBreaker#fire
     */
    this.emit('fire', args);

    if (this.opened || (this.halfOpen && this[PENDING_CLOSE])) {
      /**
       * Emitted when the circuit breaker is open and failing fast
       * @event CircuitBreaker#reject
       */
      this.emit('reject', new Error('Breaker is open'));
      const failure = fail(this, 'Breaker is open', args);
      return fallback(this, 'Breaker is open', args) || failure;
    }
    this[PENDING_CLOSE] = this.halfOpen;

    let timeout;
    let timeoutError = false;
    const value = new this.Promise((resolve, reject) => {
      timeout = setTimeout(
        () => {
          timeoutError = true;
          const error = new Error(`Timed out after ${this.options.timeout}ms`);
          /**
           * Emitted when the circuit breaker action takes longer than `options.timeout`
           * @event CircuitBreaker#timeout
           */
          this.emit('timeout', error);
          resolve(fallback(this, error, args) || fail(this, error, args));
        }, this.options.timeout);

      try {
        const result = this.action.apply(this.action, args);
        const promise = (typeof result.then === 'function')
          ? result
          : this.Promise.resolve(result);

        promise
          .then((result) => {
            if (!timeoutError) {
              /**
               * Emitted when the circuit breaker action succeeds
               * @event CircuitBreaker#success
               */
              this.emit('success', result);
              resolve(result);
              clearTimeout(timeout);
            }
          })
          .catch((error) =>
            handleError(error, this, timeout, args, resolve, reject));
      } catch (error) {
        handleError(error, this, timeout, args, resolve, reject);
      }
    });
    if (this.options.cache) {
      CACHE.set(this, value);
    }
    return value;
  }

  /**
   * Clears the cache of this {@link CircuitBreaker}
   */
  clearCache () {
    CACHE.set(this, undefined);
  }
}

function handleError (error, circuit, timeout, args, resolve, reject) {
  clearTimeout(timeout);
  fail(circuit, error, args);
  const fb = fallback(circuit, error, args);
  if (fb) resolve(fb);
  else reject(error);
}

function fallback (circuit, err, args) {
  if (circuit[FALLBACK_FUNCTION]) {
    return new circuit.Promise((resolve, reject) => {
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

function fail (circuit, err, args) {
  /**
   * Emitted when the circuit breaker action fails,
   * or when the circuit is fired while open.
   * @event CircuitBreaker#failure
   */
  circuit.emit('failure', err);
  circuit[NUM_FAILURES] += 1;

  if (circuit[NUM_FAILURES] >= circuit.options.maxFailures) {
    circuit.open();
  }
  return circuit.Promise.reject.apply(null, [err]);
}

module.exports = exports = CircuitBreaker;
