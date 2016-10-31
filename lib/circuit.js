'use strict';

const EventEmitter = require('events');

const STATE = Symbol('state');
const OPEN = Symbol('open');
const CLOSED = Symbol('closed');
const HALF_OPEN = Symbol('half-open');
const PENDING_CLOSE = Symbol('pending-close');
const FALLBACK_FUNCTION = Symbol('fallback');

class CircuitBreaker extends EventEmitter {
  constructor (action, options) {
    super();
    if (typeof action !== 'function') this.action = () => action;
    else this.action = action;
    this.options = options;
    this.status = new Status();
    this.Promise = options.Promise;
    this[STATE] = CLOSED;
    this[FALLBACK_FUNCTION] = null;
    this[PENDING_CLOSE] = false;

    function _startTimer (circuit) {
      return () =>
        setTimeout(() => {
          circuit[STATE] = HALF_OPEN;
          circuit.emit('halfOpen');
        }, circuit.options.resetTimeout).unref();
    }

    function _succeed (circuit) {
      return () => {
        circuit.status.successes++;
        circuit.close();
      };
    }

    function _fail (circuit) {
      return () => {
        circuit.status.failures++;
        circuit.open();
      };
    }

    this.on('open', _startTimer(this));
    this.on('success', _succeed(this));
    this.on('failure', _fail(this));
  }

  close () {
    this.status.failures = 0;
    if (this[STATE] !== CLOSED) {
      this[STATE] = CLOSED;
      this.emit('close');
    }
  }

  open () {
    if (this.status.failures >= this.options.maxFailures &&
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
    this.status.fires++;
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
      circuit.status.fallbacks++;
      resolve(circuit[FALLBACK_FUNCTION].apply(circuit[FALLBACK_FUNCTION], args));
    });
  }
  return circuit.Promise.reject.apply(null, [err]);
}

class Status {
  constructor () {
    this.failures = 0;
    this.fallbacks = 0;
    this.successes = 0;
    this.fires = 0;
  }
}

module.exports = exports = CircuitBreaker;
