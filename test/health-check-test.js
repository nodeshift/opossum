'use strict';

const test = require('tape');
const CircuitBreaker = require('../lib/circuit');
const common = require('./common');

test('Circuits accept a health check function', t => {
  t.plan(1);
  const circuit = new CircuitBreaker(common.passFail);
  circuit.healthCheck(healthChecker(_ => {
    t.ok(true, 'function called');
    circuit.shutdown();
    t.end();
    return Promise.resolve();
  }), 10000);
});

test('healthCheckFailed is emitted on failure', t => {
  t.plan(1);
  const circuit = new CircuitBreaker(common.passFail);
  circuit.on('healthCheckFailed', e => {
    t.equals(e.message, 'Too many tacos', 'healthCheckFailed emitted');
    circuit.shutdown();
    t.end();
  });
  circuit.healthCheck(
    healthChecker(_ => Promise.reject(new Error('Too many tacos'))), 10000);
});

test('circuit opens on health check failure', t => {
  t.plan(1);
  const circuit = new CircuitBreaker(common.passFail);
  circuit.on('open', e => {
    t.ok(circuit.opened, 'circuit opened');
    circuit.shutdown();
    t.end();
  });
  circuit.healthCheck(
    healthChecker(_ => Promise.reject(new Error('Too many tacos'))), 10000);
});

test('Health check function executes in the circuit breaker context', t => {
  t.plan(1);
  let called = false;
  const circuit = new CircuitBreaker(common.passFail);
  circuit.healthCheck(function healthCheck () {
    if (!called) {
      t.equal(this, circuit, 'health check executes in circuit context');
      circuit.shutdown();
      t.end();
    }
    called = true;
    return Promise.resolve();
  }, 10000);
});

test('healthCheck() throws TypeError if interval duration is NaN', t => {
  t.plan(2);
  const circuit = new CircuitBreaker(common.passFail);
  try {
    circuit.healthCheck(_ => {}, 'Biscuits and gravy');
    t.fail('Circuit breaker did not throw TypeError');
  } catch (e) {
    t.equals(e.constructor, TypeError, 'throws TypeError');
    t.equals(e.message, 'Health check interval must be a number',
      'include correct message');
    circuit.shutdown();
    t.end();
  }
});

test('healthCheck() throws TypeError if parameter is not a function', t => {
  t.plan(2);
  const circuit = new CircuitBreaker(common.passFail);
  try {
    circuit.healthCheck('Biscuits and gravy');
    t.fail('Circuit breaker did not throw TypeError');
  } catch (e) {
    t.equals(e.constructor, TypeError, 'throws TypeError');
    t.equals(e.message, 'Health check function must be a function',
      'include correct message');
    circuit.shutdown();
    t.end();
  }
});

const healthChecker = func => _ => {
  let called = false;
  if (!called) return func();
  called = true;
  return Promise.resolve();
};
