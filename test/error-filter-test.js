'use strict';

const test = require('tape');
const CircuitBreaker = require('../');
const { failWithCode, passFail } = require('./common');

const options = {
  errorThresholdPercentage: 1,
  resetTimeout: 10000,
  // if this function returns true, the error statistics
  // should not be incremented
  errorFilter: err => err.statusCode < 500
};

test('Bypasses failure stats if errorFilter returns true - Should return a success', t => {
  t.plan(4);

  const breaker = new CircuitBreaker(failWithCode, options);
  breaker.fire(400)
    .then(t.fail)
    .catch(err => {
      t.equal(err.statusCode, 400);
      t.equal(breaker.stats.failures, 0);
      t.equal(breaker.stats.successes, 1);
      t.ok(breaker.closed);
      t.end();
    })
    .catch(_ => {
      t.fail();
    });
});

test('Increments failure stats if errorFilter returns false', t => {
  t.plan(3);

  const breaker = new CircuitBreaker(failWithCode, options);
  breaker.fire(500)
    .then(t.fail)
    .catch(err => {
      t.equal(err.statusCode, 500);
      t.equal(breaker.stats.failures, 1);
      t.ok(breaker.open);
      t.end();
    });
});

test('Increments failure stats if no filter is provided', t => {
  t.plan(3);
  const breaker = new CircuitBreaker(failWithCode,
    { errorThresholdPercentage: 1 });
  breaker.fire(500)
    .then(t.fail)
    .catch(err => {
      t.equal(err.statusCode, 500);
      t.equal(breaker.stats.failures, 1);
      t.ok(breaker.open);
      t.end();
    });
});

test('Provides invocation parameters to error filter', t => {
  t.plan(3);
  const errorCode = 504;
  const breaker = new CircuitBreaker(failWithCode,
    {
      errorThresholdPercentage: 1,
      errorFilter: (err, param) => {
        t.equal(param, errorCode);
        t.equal(err.statusCode, errorCode);
      }
    }
  );
  breaker.fire(errorCode)
    .then(t.fail)
    .catch(err => {
      t.equal(err.statusCode, errorCode);
      t.end();
    });
});

test('A successful errorFilter should not invoke the fallback function', t => {
  t.plan(1);
  const breaker = new CircuitBreaker(passFail,
    {
      errorThresholdPercentage: 1,
      errorFilter: _ => {
        t.ok(true, 'Error filter invoked');
        return true;
      },
      fallback: _ => t.fail('Fallback function should not be called')
    });
  breaker.fire(-1).catch(_ => t.end());
});

test('A successful errorFilter should still return the error from function invocation', t => {
  t.plan(2);
  const breaker = new CircuitBreaker(passFail,
    {
      errorThresholdPercentage: 1,
      errorFilter: _ => t.ok(true, 'Error filter invoked'),
      fallback: _ => t.fail('Fallback function should not be called')
    });
  breaker.fire(-1).catch(err => {
    console.error(err);
    t.equal(err, 'Error: -1 is < 0');
    t.end();
  });
});
