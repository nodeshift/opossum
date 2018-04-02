'use strict';

const test = require('tape');
const opossum = require('..');
const common = require('./common');

test('Circuits accept a health check function', t => {
  t.plan(1);
  const circuit = opossum(common.passFail);
  circuit.healthCheck(healthChecker(_ => {
    t.ok(true, 'function called');
    t.end();
    return Promise.resolve();
  }), 10000);
});

test('health-check-failed is emitted on failure', t => {
  t.plan(1);
  const circuit = opossum(common.passFail);
  circuit.on('health-check-failed', e => {
    t.equals(e.message, 'Too many tacos', 'health-check-failed emitted');
    t.end();
  });
  circuit.healthCheck(
    healthChecker(_ => Promise.reject(new Error('Too many tacos'))), 10000);
});

test('circuit opens on health check failure', t => {
  t.plan(1);
  const circuit = opossum(common.passFail);
  circuit.on('open', _ => {
    t.ok(circuit.opened, 'circuit opened');
    t.end();
  });
  circuit.healthCheck(
    healthChecker(_ => Promise.reject(new Error('Too many tacos'))), 10000);
});

test('Health check function executes in the circuit breaker context', t => {
  t.plan(1);
  let called = false;
  const circuit = opossum(common.passFail);
  function healthCheck () {
    if (!called) {
      t.equal(this, circuit, 'health check executes in circuit context');
      t.end();
    }
    called = true;
    return Promise.resolve();
  }
  circuit.healthCheck(healthCheck, 10000);
});

test('healthCheck() throws TypeError if interval duration is NaN', t => {
  t.plan(2);
  const circuit = opossum(common.passFail);
  try {
    circuit.healthCheck(_ => {}, 'Biscuits and gravy');
    t.fail('Circuit breaker did not throw TypeError');
  } catch (e) {
    t.equals(e.constructor, TypeError, 'throws TypeError');
    t.equals(e.message, 'Health check interval must be a number',
      'include correct message');
    t.end();
  }
});

test('healthCheck() throws TypeError if parameter is not a function', t => {
  t.plan(2);
  const circuit = opossum(common.passFail);
  try {
    circuit.healthCheck('Biscuits and gravy');
    t.fail('Circuit breaker did not throw TypeError');
  } catch (e) {
    t.equals(e.constructor, TypeError, 'throws TypeError');
    t.equals(e.message, 'Health check function must be a function',
      'include correct message');
    t.end();
  }
});

function healthChecker (func) {
  return _ => {
    let called = false;
    if (!called) {
      return func();
    }
    called = true;
    return Promise.resolve();
  };
}
