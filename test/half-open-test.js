'use strict';

const test = require('tape');
const CircuitBreaker = require('../');
const { timedFailingFunction, failWithCode } = require('./common');

test('When half-open, the circuit only allows one request through', t => {
  t.plan(10);
  const options = {
    errorThresholdPercentage: 1,
    resetTimeout: 100
  };

  const breaker = new CircuitBreaker(timedFailingFunction, options);
  breaker.fire(1)
    .then(t.fail)
    .catch(e => t.equals(e, 'Failed after 1'))
    .then(() => {
      t.ok(breaker.opened, 'should be open after initial fire');
      t.notOk(breaker.pendingClose,
        'should not be pending close after initial fire');
    });

  // Fire again after reset timeout. should be half open
  setTimeout(() => {
    t.ok(breaker.halfOpen, 'should be halfOpen after timeout');
    t.ok(breaker.pendingClose, 'should be pending close after timeout');
    breaker
      .fire(500) // fail after a long time, letting other fire()s occur
      .catch(e => t.equals(e, 'Failed after 500', 'should fail again'))
      .then(() => {
        t.ok(breaker.opened,
          'should be open again after long failing function');
        t.notOk(breaker.halfOpen,
          'should not be halfOpen after long failing function');
        t.notOk(breaker.pendingClose,
          'should not be pending close after long failing func');
      })
      .then(_ => {
        // fire the breaker again, and be sure it fails as expected
        breaker
          .fire(1)
          .catch(e => t.equals(e.message, 'Breaker is open'));
      })
      .then(_ => breaker.shutdown())
      .then(t.end);
  }, options.resetTimeout * 1.5);
});

test('When half-open, a filtered error should close the circuit', t => {
  t.plan(7);
  const options = {
    errorThresholdPercentage: 1,
    resetTimeout: 100,
    errorFilter: err => err.statusCode < 500
  };

  const breaker = new CircuitBreaker(failWithCode, options);
  breaker.fire(500)
    .then(t.fail)
    .catch(e => t.equals(e.message, 'Failed with 500 status code'))
    .then(() => {
      t.ok(breaker.opened, 'should be open after initial fire');
      t.notOk(breaker.pendingClose,
        'should not be pending close after initial fire');

      // Fire again after reset timeout. should be half open
      setTimeout(() => {
        t.ok(breaker.halfOpen, 'should be halfOpen after timeout');
        t.ok(breaker.pendingClose, 'should be pending close after timeout');
        breaker
          .fire(400) // fail with a filtered error
          .catch(e =>
            t.equals(e.message, 'Failed with 400 status code',
              'should fail again'))
          .then(() => {
            t.ok(breaker.closed,
              'should be closed after passing with filtered error');
          })
          .then(_ => breaker.shutdown())
          .then(t.end);
      }, options.resetTimeout * 1.5);
    });
});
