'use strict';

const test = require('tape');
const opossum = require('../');
const { passFail } = require('./common');

test('By default does not have a volume threshold', t => {
  t.plan(3);
  const options = {
    errorThresholdPercentage: 1,
    resetTimeout: 100
  };

  const breaker = opossum(passFail, options);
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

  const breaker = opossum(passFail, options);
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
            'should not be open before volume threshold has been reached');
          t.notOk(breaker.pendingClose,
            'should not be pending close before volume threshold has been reached');
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
