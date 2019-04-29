'use strict';

const test = require('tape');
const opossum = require('../');

function mightFail (errorCode) {
  const err = new Error('Something went wrong');
  err.statusCode = errorCode;
  return Promise.reject(err);
}

const options = {
  errorThresholdPercentage: 1,
  resetTimeout: 10000,
  // if this function returns true, the error statistics
  // should not be incremented
  errorFilter: err => err.statusCode < 500
};

test('Bypasses failure stats if errorFilter returns true', t => {
  t.plan(3);

  const breaker = opossum(mightFail, options);
  breaker.fire(400)
    .then(t.fail)
    .catch(err => {
      t.equal(err.statusCode, 400);
      t.equal(breaker.stats.failures, 0);
      t.ok(breaker.closed);
      t.end();
    });
});

test('Increments failure stats if errorFilter returns false', t => {
  t.plan(3);

  const breaker = opossum(mightFail, options);
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
  const breaker = opossum(mightFail, { errorThresholdPercentage: 1 });
  breaker.fire(500)
    .then(t.fail)
    .catch(err => {
      t.equal(err.statusCode, 500);
      t.equal(breaker.stats.failures, 1);
      t.ok(breaker.open);
      t.end();
    });
});
