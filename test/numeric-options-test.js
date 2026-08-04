'use strict';

const test = require('tape');
const CircuitBreaker = require('../');
const { passFail } = require('./common');

const numericOptions = [
  'timeout',
  'resetTimeout',
  'errorThresholdPercentage',
  'rollingCountTimeout',
  'rollingCountBuckets',
  'cacheTTL',
  'coalesceTTL'
];

test('Numeric options reject NaN', t => {
  t.plan(numericOptions.length);
  numericOptions.forEach(name => {
    t.throws(
      () => new CircuitBreaker(passFail, { [name]: NaN }),
      /must be a finite number/,
      `${name}: NaN is rejected`);
  });
  t.end();
});

test('Numeric options reject Infinity', t => {
  t.plan(numericOptions.length);
  numericOptions.forEach(name => {
    t.throws(
      () => new CircuitBreaker(passFail, { [name]: Infinity }),
      /must be a finite number/,
      `${name}: Infinity is rejected`);
  });
  t.end();
});

test('Numeric options reject non-numeric types', t => {
  t.plan(2);
  t.throws(
    () => new CircuitBreaker(passFail, { timeout: '1000' }),
    /must be a finite number/,
    'a numeric string is rejected');
  t.throws(
    () => new CircuitBreaker(passFail, { resetTimeout: {} }),
    /must be a finite number/,
    'an object is rejected');
  t.end();
});

test('Numeric options still accept 0 and valid numbers', t => {
  t.plan(4);
  const zeroTimeout = new CircuitBreaker(passFail, { timeout: 0 });
  t.equal(zeroTimeout.options.timeout, 0,
    'timeout: 0 is preserved and still disables the timeout');

  const withCacheTTL = new CircuitBreaker(passFail, { cacheTTL: 0 });
  t.equal(withCacheTTL.options.cacheTTL, 0, 'cacheTTL: 0 is preserved');

  const configured = new CircuitBreaker(passFail, { timeout: 500 });
  t.equal(configured.options.timeout, 500, 'a valid number is preserved');

  const defaulted = new CircuitBreaker(passFail, {});
  t.equal(defaulted.options.timeout, 10000,
    'an omitted option still receives its default');
  t.end();
});

test('timeout: false still disables the timeout', t => {
  t.plan(1);
  const breaker = new CircuitBreaker(passFail, { timeout: false });
  t.equal(breaker.options.timeout, false,
    'the documented disabled form is preserved');
  t.end();
});

test('coalesceTTL inherits a validated timeout', t => {
  t.plan(1);
  const breaker = new CircuitBreaker(passFail, { timeout: 250 });
  t.equal(breaker.options.coalesceTTL, 250,
    'coalesceTTL defaults to the validated timeout');
  t.end();
});
