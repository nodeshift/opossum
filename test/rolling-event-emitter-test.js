'use strict';

const test = require('tape');
const CircuitBreaker = require('../');
const { passFail } = require('./common');
const EventEmitter = require('events').EventEmitter;

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
  breakerToBeDisabled.shutdown();
  breakerNotToBeDisabled.shutdown();
  t.end();
});

test('Event listener should be re-added when circuit is re-enabled', t => {
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
  breaker.shutdown();
  t.end();
});

test('Listener should not be attached with a call to enable if there is already a listener', t => {
  t.plan(2);
  const emitter = new EventEmitter();
  const breaker = new CircuitBreaker(passFail, {
    rotateBucketController: emitter
  });
  t.equals(emitter.listeners('rotate').length, 1, 'listener attached automatically');
  breaker.enable();
  t.equals(emitter.listeners('rotate').length, 1, 'listener should not be added again');
  breaker.shutdown();
  t.end();
});

test('Listener should not be attached with a call to enable if there is already a listener and there is another breaker in the mix', t => {
  t.plan(2);
  const emitter = new EventEmitter();
  const breaker = new CircuitBreaker(passFail, {
    rotateBucketController: emitter
  });
  const anotherBreaker = new CircuitBreaker(passFail, {
    rotateBucketController: emitter
  });
  t.equals(emitter.listeners('rotate').length, 2, 'listener attached automatically');
  breaker.enable();
  t.equals(emitter.listeners('rotate').length, 2, 'listener should not be added again');
  breaker.shutdown();
  anotherBreaker.shutdown();
  t.end();
});
