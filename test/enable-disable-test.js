'use strict';

const test = require('tape');
const CircuitBreaker = require('../');
const { passFail } = require('./common');
const EventEmitter = require('events').EventEmitter;

test('Defaults to enabled', t => {
  t.plan(1);
  const breaker = new CircuitBreaker(passFail);
  t.equals(breaker.enabled, true);
  breaker.shutdown();
  t.end();
});

test('Accepts options.enabled', t => {
  t.plan(1);
  const breaker = new CircuitBreaker(passFail, { enabled: false });
  t.equals(breaker.enabled, false);
  breaker.shutdown();
  t.end();
});

test('When disabled the circuit should always be closed', t => {
  t.plan(8);
  const options = {
    errorThresholdPercentage: 1,
    resetTimeout: 1000
  };

  const breaker = new CircuitBreaker(passFail, options);
  breaker.disable();
  breaker.fire(-1)
    .catch(e => t.equals(e, 'Error: -1 is < 0'))
    .then(() => {
      t.ok(breaker.closed, 'should be closed');
      t.notOk(breaker.pendingClose,
        'should not be pending close');
    })
    .then(() => {
      breaker // fire and fail again
        .fire(-1)
        .catch(e => t.equals(e, 'Error: -1 is < 0'))
        .then(() => {
          t.ok(breaker.closed, 'should be closed');
          t.notOk(breaker.pendingClose,
            'should not be pending close');
        });
    })
    .then(() => { // reenable the circuit
      breaker.enable();
      breaker.fire(-1)
        .catch(e => t.equals(e, 'Error: -1 is < 0'))
        .then(() => {
          t.ok(breaker.opened, 'should be open');
        })
        .then(_ => breaker.shutdown())
        .then(t.end);
    });
});

test('When disabled, the event emitter listener should be removed', t => {
  t.plan(2);
  const emitter = new EventEmitter();
  const breaker = new CircuitBreaker(passFail, {
    rotateBucketController: emitter
  });
  t.equals(emitter.listeners('rotate').length, 1, 'listener attached automatically');
  breaker.disable();
  t.equals(emitter.listeners('rotate').length, 0, 'listener removed when breaker disabled');
  breaker.shutdown();
  t.end();
});

test('Event listener should be removed only for the breaker that is disabled', t => {
  t.plan(2);
  const emitter = new EventEmitter();
  const breakerToBeDisabled = new CircuitBreaker(passFail, {
    rotateBucketController: emitter
  });
  const breakerNotToBeDisabled = new CircuitBreaker(passFail, {
    rotateBucketController: emitter
  });
  t.equals(emitter.listeners('rotate').length, 2, '1 listener attached for each breaker');
  breakerToBeDisabled.disable();
  t.equals(emitter.listeners('rotate').length, 1, '1 listener should be disabled and 1 should remain');
  t.end();
});

test.only('Event listener should be re-added when circuit is re-enabled', t => {
  t.plan(3);
  const emitter = new EventEmitter();
  const breaker = new CircuitBreaker(passFail, {
    rotateBucketController: emitter
  });
  t.equals(emitter.listeners('rotate').length, 1, 'listener attached automatically');
  breaker.disable();
  t.equals(emitter.listeners('rotate').length, 0, 'listener removed when breaker disabled');
  breaker.enable();
  t.equals(emitter.listeners('rotate').length, 1, 'listener re-attached when breaker re-enabled');
  t.end();
});
