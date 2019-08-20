'use strict';

const test = require('tape');
const CircuitBreaker = require('../');
const { passFail } = require('./common');

test('By default does not have a volume threshold', t => {
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

test('Has a volume threshold before tripping when option is provided', t => {
  t.plan(6);
  const options = {
    errorThresholdPercentage: 1,
    resetTimeout: 100,
    volumeThreshold: 3
  };

  const breaker = new CircuitBreaker(passFail, options);
  breaker.fire(-1)
    .then(t.fail)
    .catch(e => {
      t.notOk(breaker.opened,
        'should not be open before volume threshold has been reached');
      t.notOk(breaker.pendingClose,
        'should not be pending close before volume threshold has been reached');
    })
    .then(_ => {
      breaker.fire(-1)
        .then(t.fail)
        .catch(e => {
          t.notOk(breaker.opened,
            'not open before volume threshold has been reached');
          t.notOk(breaker.pendingClose,
            'not pending close before volume threshold has been reached');
        })
        .then(_ => {
          breaker.fire(-1)
            .catch(e => {
              t.equals(e, 'Error: -1 is < 0');
              t.ok(breaker.opened,
                'should be open after volume threshold has been reached');
            })
            .then(breaker.shutdown())
            .then(t.end);
        });
    });
});

// TODO: This test is a little flakey and depends on the machine
// where the test is running to be reasonably fast due to timeouts
test('volume threshold does not affect halfOpen state', t => {
  t.plan(5);
  const options = {
    errorThresholdPercentage: 1,
    resetTimeout: 300,
    rollingCountTimeout: 300,
    volumeThreshold: 2
  };

  const breaker = new CircuitBreaker(passFail, options);
  breaker.fire(-1)
    .then(t.fail)
    .catch(_ => {
      t.ok(breaker.closed, 'breaker should still be open after one failure');
      breaker.fire(-1)
        .then(t.fail)
        .catch(e => {
          t.ok(breaker.opened, 'breaker should be open');
        }).then(_ => {
          setTimeout(_ => { // ensure that we have entered the halfOpen state
            t.ok(breaker.halfOpen, 'breaker should be in halfOpen state');
            t.ok(breaker.stats.fires === 0, 'statistical window cleared');
            // now fail again and ensure that we reenter the open state
            breaker.fire(-1)
              .then(t.fail)
              .catch(_ => {
                t.ok(breaker.opened, 'breaker should be in the open state');
              })
              .then(_ => t.end());
          }, options.resetTimeout * 1.5);
        });
    });
});
