'use strict';

const test = require('tape');
const CircuitBreaker = require('../');
const { timedFailingFunction } = require('./common');

test('when open() is called it cancels the resetTimeout', t => {
  t.plan(5);
  const options = {
    errorThresholdPercentage: 1,
    resetTimeout: 100
  };

  const breaker = new CircuitBreaker(timedFailingFunction, options);
  breaker.fire(0)
    .then(t.fail)
    .catch(e => t.equals(e, 'Failed after 0'))
    .then(() => {
      t.ok(breaker.opened, 'should be open after initial fire');
      t.notOk(breaker.pendingClose,
        'should not be pending close after initial fire');
      breaker.open();
    });

  setTimeout(() => {
    t.ok(breaker.opened, 'should not have been opened by the resetTimeout');
    t.notOk(breaker.pendingClose,
      'should still not be pending close');
    t.end();
  }, options.resetTimeout * 1.5);
});
