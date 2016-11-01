'use strict';

const CIRCUIT_BREAKER = Symbol('circuit-breaker');

class Status {
  constructor (circuit) {
    this.failures = 0;
    this.fallbacks = 0;
    this.successes = 0;
    this.rejects = 0;
    this.fires = 0;
    this[CIRCUIT_BREAKER] = circuit;
    circuit.on('success', () => this.successes++);
    circuit.on('failure', () => this.failures++);
    circuit.on('fallback', () => this.fallbacks++);
    circuit.on('fire', () => this.fires++);
    circuit.on('reject', () => this.rejects++);
  }
}

module.exports = exports = Status;
