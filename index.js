'use strict';

const Fidelity = require('fidelity');

const defaults = {
  timeout: 10000, // 10 seconds
  maxFailures: 10,
  resetTimeout: 30000, // 30 seconds
  Promise: Fidelity
};

function circuitBreaker (action, options) {
  return new CircuitBreaker(action, Object.assign({}, defaults, options));
}

const state = Symbol('state');
const open = Symbol('open');
const closed = Symbol('closed');
const halfOpen = Symbol('half-open');
const halfOpenAttempted = Symbol('half-open-attempted');
const fallbackFunction = Symbol('fallback');

class CircuitBreaker {
  constructor (action, options) {
    this.action = action;
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
    if (this.open || (this.halfOpen && this[halfOpenAttempted])) {
      return failFast(this, Array.prototype.slice.call(arguments));
    }

    this[halfOpenAttempted] = this.halfOpen;
    return new this.Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        fail(this);
        reject(`Action timed out after ${this.options.timeout}ms`);
      },
      this.options.timeout);

      this.action.apply(this.action, arguments)
        .then((result) => {
          succeed(this);
          resolve(result);
          clearTimeout(timeout);
        })
        .catch((err) => {
          fail(this);
          reject(err);
          clearTimeout(timeout);
        });
    });
  }
}

function failFast (circuit, args) {
  if (circuit[fallbackFunction]) {
    return new circuit.Promise((resolve, reject) => {
      resolve(circuit[fallbackFunction].apply(circuit[fallbackFunction], args));
    });
  }
  return circuit.Promise.reject('Breaker is open');
}

function succeed (circuit) {
  circuit.status.failures = 0;
  circuit.status.fires++;
  circuit[state] = closed;
}

function fail (circuit) {
  circuit.status.failures++;
  if (circuit.status.failures >= circuit.options.maxFailures) {
    circuit[state] = open;
    setTimeout(() => {
      circuit[state] = halfOpen;
    }, circuit.options.resetTimeout).unref();
  }
}

class Status {
  constructor (failures, fires) {
    this.failures = failures || 0;
    this.fires = 0;
  }
}

module.exports = exports = circuitBreaker;
