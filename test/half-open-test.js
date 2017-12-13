'use strict';

const test = require('tape');
const opossum = require('../');
const { timedFailingFunction } = require('./common');

test('When half-open, the circuit only allows one request through', t => {
  t.plan(12);
  const options = {
    errorThresholdPercentage: 1,
    resetTimeout: 500
  };

  const breaker = opossum(timedFailingFunction, options);
  breaker.fire(1)
    .catch((e) => t.equals(e, 'Failed after 1'))
    .then(() => {
      t.ok(breaker.opened, 'breaker should be open');
      t.notOk(breaker.pendingClose, 'breaker should not be pending close');
    })
    .then(() => {
      setTimeout(() => {
        t.ok(breaker.halfOpen, 'breaker should be halfOpen');
        t.ok(breaker.pendingClose, 'breaker should be pending close');
        breaker
          .fire(500) // fail after a long time, letting possibly other fire()s to occur
          .catch((e) => t.equals(e, 'Failed after 500', 'function should fail again'))
          .then(() => {
            t.ok(breaker.opened, 'breaker should be open again');
            t.notOk(breaker.halfOpen, 'breaker should not be halfOpen');
            t.notOk(breaker.pendingClose, 'breaker should not be pending close');
          });
      }, options.resetTimeout * 1.1);
    });
  // fire the breaker again, and be sure it fails as expected
  breaker.fire(1)
    .catch((e) => t.equals(e, 'Failed after 1'))
    .then(() => {
      t.ok(breaker.opened, 'breaker should be open');
      t.notOk(breaker.pendingClose, 'breaker should not be pending close');
    });
});
