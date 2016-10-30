'use strict';

const CircuitBreaker = require('./lib/circuit');
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

circuitBreaker.promisify = require('./lib/promisify');

module.exports = exports = circuitBreaker;
