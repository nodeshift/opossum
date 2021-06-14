'use strict';

const test = require('tape');
const CircuitBreaker = require('../');
const { timedFailingFunction, passFail } = require('./common');

test('CircuitBreaker State - export the state of a breaker instance', t => {
  t.plan(8);
  const breaker = new CircuitBreaker(passFail);

  t.ok(breaker.exportState, 'has the exportState function');
  const breakerState = breaker.exportState();

  t.equal(breakerState.enabled, true, 'enabled initialized value');
  t.equal(breakerState.closed, true, 'closed initialized value');
  t.equal(breakerState.open, false, 'open initialized value');
  t.equal(breakerState.halfOpen, false, 'half open initialized value');
  t.equal(breakerState.warmUp, false, 'warmup initialized value');
  t.equal(breakerState.pendingClose, false, 'pendingClose initialized value');
  t.equal(breakerState.shutdown, false, 'shutdown initialized value');
  t.end();
});

test('CircuitBreaker State - initalize the breaker as Closed', t => {
  t.plan(9);

  const state = {
    enabled: true,
    closed: true,
    open: false,
    halfOpen: false,
    warmUp: false,
    pendingClose: false,
    shutdown: false
  };

  const breaker = new CircuitBreaker(passFail, {state});
  const breakerState = breaker.exportState();

  t.equal(breakerState.enabled, true, 'enabled primed value');
  t.equal(breakerState.closed, true, 'closed primed value');
  t.equal(breakerState.open, false, 'open primed value');
  t.equal(breakerState.halfOpen, false, 'half open primed value');
  t.equal(breakerState.warmUp, false, 'warmup primed value');
  t.equal(breakerState.pendingClose, false, 'pendingClose primed value');
  t.equal(breakerState.shutdown, false, 'shutdown primed value');

  breaker.fire(-1).then(() => {
    t.fail();
  }).catch(() => {
    t.equal(breaker.opened, true, 'breaker should be open');
    t.equal(breaker.closed, false, 'breaker should not be closed');

    t.end();
  });
});

test('Pre-populate state as Open - Breaker resets after a configurable amount of time', t => {
  t.plan(1);
  const resetTimeout = 100;
  const breaker = new CircuitBreaker(passFail, {
    errorThresholdPercentage: 1,
    resetTimeout,
    state: {
      open: true
    }
  });

  // Now the breaker should be open. Wait for reset and
  // fire again.
  setTimeout(() => {
    breaker.fire(100)
      .catch(t.fail)
      .then(arg => t.equals(arg, 100, 'breaker has reset'))
      .then(_ => breaker.shutdown())
      .then(t.end);
  }, resetTimeout * 1.25);
});

test('When half-open, the circuit only allows one request through', t => {
  t.plan(7);
  const options = {
    errorThresholdPercentage: 1,
    resetTimeout: 100,
    state: {
      halfOpen: true
    }
  };

  const breaker = new CircuitBreaker(timedFailingFunction, options);
  t.ok(breaker.halfOpen, 'should be halfOpen on initalize');
  t.ok(breaker.pendingClose, 'should be pending close on initalize');

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
});

test('Circuit initalized as shutdown', t => {
  t.plan(5);
  const options = {
    state: {
      shutdown: true
    }
  };
  const breaker = new CircuitBreaker(passFail, options);
  t.ok(breaker.isShutdown, 'breaker is shutdown');
  t.notOk(breaker.enabled, 'breaker has been disabled');
  breaker.fire(1)
    .then(t.fail)
    .catch(err => {
      t.equals('ESHUTDOWN', err.code);
      t.equals('The circuit has been shutdown.', err.message);
      t.equals(
        CircuitBreaker.isOurError(err), true, 'isOurError() should return true'
      );
      t.end();
    });
});
