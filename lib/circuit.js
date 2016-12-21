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
     * Emitted after options.resetTimeout has elapsed, allowing for
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
   * Opens the breaker, returning a failed Promise each time the
   * breaker is fired, or falling back to any fallback function
   * that has been provided.
   * @fires CircuitBreaker#open
   */
  open () {
    this[PENDING_CLOSE] = false;
    if (this[STATE] !== OPEN) {
      this[STATE] = OPEN;
      /**
       * Emitted when the breaker action fails more than options.maxFailures
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
   * function will be executed when the breaker opens, instead of returning
   * a rejected Promise.
   * @param func {Function} the fallback function to execute when the breaker
   * has opened or when a timeout or error occurs.
   * @return {@link CircuitBreaker} this
   */
  fallback (func) {
    this[FALLBACK_FUNCTION] = func;
    return this;
  }

  /**
   * Execute the action for this circuit. If the action fails or times out, the
   * returned promise will be rejected. If the action succeeds, the promise will
   * resolve with the resolved value from action.
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
     * Emitted when the breaker action is executed
     * @event CircuitBreaker#fire
     */
    this.emit('fire', args);

    if (this.opened || (this.halfOpen && this[PENDING_CLOSE])) {
      /**
       * Emitted when the breaker is open and failing fast
       * @event CircuitBreaker#reject
       */
      this.emit('reject', new Error('Breaker is open'));
      return fail(this, 'Breaker is open', args);
    }
    this[PENDING_CLOSE] = this.halfOpen;

    let timeout;
    let timeoutError = false;
    try {
      return new this.Promise((resolve, reject) => {
        timeout = setTimeout(
          () => {
            timeoutError = true;
            const error = new Error(`Timed out after ${this.options.timeout}ms`);
            /**
             * Emitted when the breaker action takes longer than options.timeout
             * @event CircuitBreaker#timeout
             */
            this.emit('timeout', error);
            fail(this, error, args);
            reject(error);
          }, this.options.timeout);

        const result = this.action.apply(this.action, args);
        const promise = (typeof result.then === 'function')
          ? result
          : this.Promise.resolve(result);

        promise
          .then((result) => {
            if (!timeoutError) {
              /**
               * Emitted when the breaker action succeeds
               * @event CircuitBreaker#success
               */
              this.emit('success', result);
              resolve(result);
              clearTimeout(timeout);
            }
          })
          .catch((error) => {
            fail(this, error, args);
            reject(error);
            clearTimeout(timeout);
          });
      });
    } catch (error) {
      clearTimeout(timeout);
      return fail(this, error, args);
    }
  }
}

function fail (circuit, err, args) {
  /**
   * Emitted when the breaker action fails
   * @event CircuitBreaker#failure
   */
  circuit.emit('failure', err);
  circuit[NUM_FAILURES] += 1;

  if (circuit[NUM_FAILURES] >= circuit.options.maxFailures) {
    circuit.open();
  }

  if (circuit[FALLBACK_FUNCTION]) {
    return new circuit.Promise((resolve, reject) => {
      const result = circuit[FALLBACK_FUNCTION].apply(circuit[FALLBACK_FUNCTION], args);
      /**
       * Emitted when the breaker executes a fallback function
       * @event CircuitBreaker#fallback
       */
      circuit.emit('fallback', result);
      resolve(result);
    });
  }
  return circuit.Promise.reject.apply(null, [err]);
}

module.exports = exports = CircuitBreaker;
