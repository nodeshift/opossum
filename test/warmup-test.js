'use strict';

const test = require('tape');
const CircuitBreaker = require('../lib/circuit');
const { passFail } = require('./common');

test('By default does not allow for warmup', t => {
  t.plan(3);
  const options = {
    errorThresholdPercentage: 1,
    resetTimeout: 100
  };

  const breaker = new CircuitBreaker(passFail, options);
  breaker.fire(-1)
    .catch(e => t.equals(e, 'Error: -1 is < 0'))
    .then(() => {
      t.ok(breaker.opened, 'should be open after initial fire');
      t.notOk(breaker.pendingClose,
        'should not be pending close after initial fire');
    })
    .then(_ => breaker.shutdown())
    .then(t.end);
});

test('Allows for warmup when option is provided', t => {
  t.plan(3);
  const options = {
    errorThresholdPercentage: 1,
    resetTimeout: 100,
    allowWarmUp: true
  };

  const breaker = new CircuitBreaker(passFail, options);
  breaker.fire(-1)
    .catch(e => t.equals(e, 'Error: -1 is < 0'))
    .then(() => {
      t.notOk(breaker.opened, 'should not be open after initial fire');
      t.notOk(breaker.pendingClose,
        'should not be pending close after initial fire');
    })
    .then(_ => breaker.shutdown())
    .then(t.end);
});

test('Only warms up for rollingCountTimeout', t => {
  t.plan(4);
  const options = {
    errorThresholdPercentage: 1,
    resetTimeout: 100,
    allowWarmUp: true,
    rollingCountTimeout: 500
  };

  const breaker = new CircuitBreaker(passFail, options);
  breaker.fire(-1)
    .catch(e => t.equals(e, 'Error: -1 is < 0'))
    .then(() => {
      t.notOk(breaker.opened, 'should not be open after initial fire');
      t.notOk(breaker.pendingClose,
        'should not be pending close after initial fire');
    })
    .then(() => {
      setTimeout(_ => {
        t.notOk(breaker.warmUp, 'Warmup should end after rollingCountTimeout');
        breaker.shutdown();
        t.end();
      }, 500);
    });
});
