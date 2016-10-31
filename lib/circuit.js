'use strict';

const EventEmitter = require('events');

const state = Symbol('state');
const open = Symbol('open');
const closed = Symbol('closed');
const halfOpen = Symbol('half-open');
const pendingClose = Symbol('pending-close');
const fallbackFunction = Symbol('fallback');

class CircuitBreaker extends EventEmitter {
  constructor (action, options) {
    super();
    if (typeof action !== 'function') this.action = () => action;
    else this.action = action;
    this.options = options;
    this.status = new Status();
    this.Promise = options.Promise;
    this[state] = closed;
    this[fallbackFunction] = null;
    this[pendingClose] = false;

    function _startTimer (circuit) {
      return () =>
        setTimeout(() => {
          circuit[state] = halfOpen;
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
        if (circuit.status.failures >= circuit.options.maxFailures &&
          circuit[state] !== open) {
          circuit[state] = open;
          circuit.emit('open');
        }
      };
    }

    this.on('open', _startTimer(this));
    this.on('success', _succeed(this));
    this.on('failure', _fail(this));
  }

  close () {
    this.status.failures = 0;
    if (this[state] !== closed) {
      this[state] = closed;
      this.emit('close');
    }
  }

  get closed () {
    return this[state] === closed;
  }

  get open () {
    return this[state] === open;
  }

  get halfOpen () {
    return this[state] === halfOpen;
  }

  fallback (func) {
    this[fallbackFunction] = func;
  }

  fire () {
    this.status.fires++;
    this.emit('fire');
    const args = Array.prototype.slice.call(arguments);

    if (this.open || (this.halfOpen && this[pendingClose])) {
      this.emit('reject');
      return failFast(this, 'Breaker is open', args);
    }

    this[pendingClose] = this.halfOpen;
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
  if (circuit[fallbackFunction]) {
    return new circuit.Promise((resolve, reject) => {
      circuit.status.fallbacks++;
      resolve(circuit[fallbackFunction].apply(circuit[fallbackFunction], args));
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
