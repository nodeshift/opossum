'use strict';

const EventEmitter = require('events');
const Status = require('./status');

const STATE = Symbol('state');
const OPEN = Symbol('open');
const CLOSED = Symbol('closed');
const HALF_OPEN = Symbol('half-open');
const FALLBACK_FUNCTION = Symbol('fallback');
const NUM_FAILURES = Symbol('num-failures');
const STATUS = Symbol('status');

/**
 * @class CircuitBreaker
 * @extends EventEmitter
 * Constructs a {@link CircuitBreaker}.
 * @fires 'fire' When the action is executed
 * @fires 'reject' When the breaker is open but fire() has been called
 * @fires 'timeout' When the breaker action has timed out
 * @fires 'success' when the breaker action completes successfully
 * @fires 'failure' when the breaker action fails
 * @fires 'open' when the breaker enters the 'open' state
 * @fires 'close' when the breaker enters the 'closed' state
 * @fires 'halfOpen' when the breaker enters the 'halfOpen' state
 * @fires 'fallback' when a fallback function has executed
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
 */
class CircuitBreaker extends EventEmitter {
  constructor (action, options) {
    super();
    if (typeof action !== 'function') this.action = () => action;
    else this.action = action;
    this.options = options;
    this.Promise = options.Promise;
    this[STATUS] = new Status(this);
    this[STATE] = CLOSED;
    this[FALLBACK_FUNCTION] = null;
    this[NUM_FAILURES] = 0;

    function _startTimer (circuit) {
      return () => {
        const timer = setTimeout(() => {
          circuit[STATE] = HALF_OPEN;
          circuit.emit('halfOpen');
        }, circuit.options.resetTimeout);
        if (typeof timer.unref === 'function') {
          timer.unref();
        }
      };
    }

    this.on('open', _startTimer(this));
    this.on('success', () => this.close());
    this.on('failure', () => this.open());
  }

  /**
   * Closes the breaker, allowing the action to execute again
   */
  close () {
    this[NUM_FAILURES] = 0;
    if (this[STATE] !== CLOSED) {
      this[STATE] = CLOSED;
      this.emit('close');
    }
  }

  /**
   * Opens the breaker, returning a failed Promise each time the
   * breaker is fired, or falling back to any fallback function
   * that has been provided.
   */
  open () {
    this[NUM_FAILURES] += 1;
    if (this[NUM_FAILURES] >= this.options.maxFailures &&
      this[STATE] !== OPEN) {
      this[STATE] = OPEN;
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
   */
  fallback (func) {
    this[FALLBACK_FUNCTION] = func;
    return this;
  }

  /**
   * Execute the action for this circuit.
   * @returns a Promise that will be rejected if there is an error, the action
   * times out, or the action fails. If the action succeeds, or if there is a
   * fallback action that is executed, the Promise will resolve.
   */
  fire () {
    this.emit('fire');
    const args = Array.prototype.slice.call(arguments);

    if (this.opened) {
      this.emit('reject');
      return failFast(this, 'Breaker is open', args);
    }

    return new this.Promise((resolve, reject) => {
      const timeout = setTimeout(
        () => {
          const timeOutFailure = failFast(this, `Time out after ${this.options.timeout}ms`, args);
          reject(timeOutFailure.value);
        }, this.options.timeout);

      this.Promise.resolve(this.action.apply(this.action, args))
        .then((result) => {
          this.emit('success');
          resolve(result);
          clearTimeout(timeout);
        })
        .catch((e) => {
          resolve(failFast(this, e, args));
          clearTimeout(timeout);
        });
    });
  }
}

function failFast (circuit, err, args) {
  circuit.emit('failure', err);
  if (circuit[FALLBACK_FUNCTION]) {
    return new circuit.Promise((resolve, reject) => {
      circuit.emit('fallback');
      resolve(circuit[FALLBACK_FUNCTION].apply(circuit[FALLBACK_FUNCTION], args));
    });
  }
  return circuit.Promise.reject.apply(null, [err]);
}

module.exports = exports = CircuitBreaker;
