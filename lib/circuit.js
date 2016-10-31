'use strict';

const state = Symbol('state');
const open = Symbol('open');
const closed = Symbol('closed');
const halfOpen = Symbol('half-open');
const halfOpenAttempted = Symbol('half-open-attempted');
const fallbackFunction = Symbol('fallback');

class CircuitBreaker {
  constructor (action, options) {
    if (typeof action !== 'function') this.action = () => action;
    else this.action = action;
    this.options = options;
    this.status = new Status();
    this.Promise = options.Promise;
    this[state] = closed;
    this[fallbackFunction] = null;
    this[halfOpenAttempted] = false;
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
    const args = Array.prototype.slice.call(arguments);

    if (this.open || (this.halfOpen && this[halfOpenAttempted])) {
      return failFast(this, 'Breaker is open', args);
    }

    this[halfOpenAttempted] = this.halfOpen;
    return new this.Promise((resolve, reject) => {
      const timeout = setTimeout(
        () => {
          const timeOutFailure = failFast(this, `Time out after ${this.options.timeout}ms`, args);
          reject(timeOutFailure.value);
        }, this.options.timeout);

      this.Promise.resolve(this.action.apply(this.action, args))
        .then((result) => {
          succeed(this);
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
  circuit.status.failures++;
  if (circuit.status.failures >= circuit.options.maxFailures) {
    circuit[state] = open;
    setTimeout(() => {
      circuit[state] = halfOpen;
    }, circuit.options.resetTimeout).unref();
  }
  if (circuit[fallbackFunction]) {
    return new circuit.Promise((resolve, reject) => {
      circuit.status.fallbacks++;
      resolve(circuit[fallbackFunction].apply(circuit[fallbackFunction], args));
    });
  }
  return circuit.Promise.reject.apply(null, [err]);
}

function succeed (circuit) {
  circuit.status.failures = 0;
  circuit.status.successes++;
  circuit[state] = closed;
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
