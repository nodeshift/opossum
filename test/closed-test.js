'use strict';

const test = require('tape');
const CircuitBreaker = require('../');

test(
  'When open, an existing request resolving does not close circuit',
  t => {
    t.plan(6);
    const options = {
      errorThresholdPercentage: 1,
      resetTimeout: 60000
    };

    const breaker = new CircuitBreaker(function (shouldPass, time) {
      return new Promise((resolve, reject) => {
        const timer = setTimeout(
          shouldPass
            ? () => resolve('success')
            : () => reject(new Error('test-error')),
          time || 0
        );
        if (typeof timer.unref === 'function') {
          timer.unref();
        }
      });
    }, options);

    const promises = [];

    promises.push(breaker.fire(true, 100)
      .then(res => t.equals(res, 'success')));

    promises.push(breaker.fire(false)
      .then(t.fail)
      .catch(e => {
        t.equals(e.message, 'test-error');
      })
      .then(() => {
        t.ok(breaker.opened, 'should be open after initial fire');
        t.notOk(breaker.pendingClose,
          'should not be pending close after initial fire');
      }));

    Promise.all(promises)
      .then(() => {
        t.ok(breaker.opened,
          'should still be open even after first fire resolved');
        t.notOk(breaker.pendingClose,
          'should still not be pending close');
      })
      .then(() => t.end());
  }
);
