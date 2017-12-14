'use strict';

const test = require('tape');
const opossum = require('../');
const { timedFailingFunction } = require('./common');

test('When half-open, the circuit only allows one request through', t => {
  t.plan(10);
  const options = {
    errorThresholdPercentage: 1,
    resetTimeout: 100
  };

  const breaker = opossum(timedFailingFunction, options);
  breaker.fire(1)
    .catch(e => t.equals(e, 'Failed after 1'))
    .then(() => {
      t.ok(breaker.opened, 'breaker should be open after initial fire');
      t.notOk(breaker.pendingClose, 'breaker should not be pending close after initial fire');
    });

  // Fire again after reset timeout. should be half open
  setTimeout(() => {
    t.ok(breaker.halfOpen, 'breaker should be halfOpen after timeout');
    t.ok(breaker.pendingClose, 'breaker should be pending close after timeout');
    breaker
      .fire(500) // fail after a long time, letting possibly other fire()s to occur
      .catch(e => t.equals(e, 'Failed after 500', 'function should fail again'))
      .then(() => {
        t.ok(breaker.opened, 'breaker should be open again after long failing function');
        t.notOk(breaker.halfOpen, 'breaker should not be halfOpen after long failing function');
        t.notOk(breaker.pendingClose, 'breaker should not be pending close after long failing function');
      });
    // fire the breaker again, and be sure it fails as expected
    breaker
      .fire(1)
      .catch(e => t.equals(e.message, 'Breaker is open'));
  }, options.resetTimeout * 1.5);
});
