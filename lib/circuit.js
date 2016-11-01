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

class CircuitBreaker extends EventEmitter {
  constructor (action, options) {
    super();
    if (typeof action !== 'function') this.action = () => action;
    else this.action = action;
    this.options = options;
    this.status = new Status(this);
    this.Promise = options.Promise;
    this[STATE] = CLOSED;
    this[FALLBACK_FUNCTION] = null;
    this[PENDING_CLOSE] = false;
    this[NUM_FAILURES] = 0;

    function _startTimer (circuit) {
      return () =>
        setTimeout(() => {
          circuit[STATE] = HALF_OPEN;
          circuit.emit('halfOpen');
        }, circuit.options.resetTimeout).unref();
    }

    this.on('open', _startTimer(this));
    this.on('success', () => this.close());
    this.on('failure', () => this.open());
  }

  close () {
    this[NUM_FAILURES] = 0;
    if (this[STATE] !== CLOSED) {
      this[STATE] = CLOSED;
      this.emit('close');
    }
  }

  open () {
    this[NUM_FAILURES] += 1;
    if (this[NUM_FAILURES] >= this.options.maxFailures &&
      this[STATE] !== OPEN) {
      this[STATE] = OPEN;
      this.emit('open');
    }
  }

  get closed () {
    return this[STATE] === CLOSED;
  }

  get opened () {
    return this[STATE] === OPEN;
  }

  get halfOpen () {
    return this[STATE] === HALF_OPEN;
  }

  fallback (func) {
    this[FALLBACK_FUNCTION] = func;
  }

  fire () {
    this.emit('fire');
    const args = Array.prototype.slice.call(arguments);

    if (this.opened || (this.halfOpen && this[PENDING_CLOSE])) {
      this.emit('reject');
      return failFast(this, 'Breaker is open', args);
    }

    this[PENDING_CLOSE] = this.halfOpen;
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
