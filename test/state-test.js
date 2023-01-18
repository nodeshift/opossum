'use strict';

const test = require('tape');
const CircuitBreaker = require('../');
const { timedFailingFunction, passFail } = require('./common');

test('CircuitBreaker State - export the state of a breaker instance', t => {
  t.plan(8);
  const breaker = new CircuitBreaker(passFail);

  t.ok(breaker.toJSON, 'has the toJSON function');
  const breakerState = breaker.toJSON();

  t.equal(breakerState.state.enabled, true, 'enabled initialized value');
  t.equal(breakerState.state.closed, true, 'closed initialized value');
  t.equal(breakerState.state.open, false, 'open initialized value');
  t.equal(breakerState.state.halfOpen, false, 'half open initialized value');
  t.equal(breakerState.state.warmUp, false, 'warmup initialized value');
  t.equal(breakerState.state.shutdown, false, 'shutdown initialized value');
  t.assert(Object.hasOwn(breakerState.state, 'lastTimerAt'), 'lastTimerAt initialized value');
  t.end();
});

test('CircuitBreaker State - export the state of a breaker instance using toJson', t => {
  t.plan(8);
  const breaker = new CircuitBreaker(passFail);

  t.ok(breaker.toJSON, 'has the toJSON function');
  const breakerState = breaker.toJSON();

  t.equal(breakerState.state.name, 'passFail', 'name initialized value');
  t.equal(breakerState.state.enabled, true, 'enabled initialized value');
  t.equal(breakerState.state.closed, true, 'closed initialized value');
  t.equal(breakerState.state.open, false, 'open initialized value');
  t.equal(breakerState.state.halfOpen, false, 'half open initialized value');
  t.equal(breakerState.state.warmUp, false, 'warmup initialized value');
  t.equal(breakerState.state.shutdown, false, 'shutdown initialized value');
  t.end();
});

test('CircuitBreaker State - initialize the breaker as Closed', t => {
  t.plan(8);

  const state = {
    enabled: true,
    closed: true,
    halfOpen: false,
    warmUp: false,
    pendingClose: false,
    shutdown: false
  };

  const breaker = new CircuitBreaker(passFail, { state });
  const breakerState = breaker.toJSON();

  t.equal(breakerState.state.enabled, true, 'enabled primed value');
  t.equal(breakerState.state.closed, true, 'closed primed value');
  t.equal(breakerState.state.open, false, 'open primed value');
  t.equal(breakerState.state.halfOpen, false, 'half open primed value');
  t.equal(breakerState.state.warmUp, false, 'warmup primed value');
  t.equal(breakerState.state.shutdown, false, 'shutdown primed value');

  breaker.fire(-1).then(() => {
    t.fail();
  }).catch(() => {
    t.equal(breaker.opened, true, 'breaker should be open');
    t.equal(breaker.closed, false, 'breaker should not be closed');

    t.end();
  });
});

test('Pre-populate state as Open(Closed === false) - Breaker resets after a configurable amount of time', t => {
  t.plan(1);
  const resetTimeout = 100;
  const breaker = new CircuitBreaker(passFail, {
    errorThresholdPercentage: 1,
    resetTimeout,
    state: {
      closed: false
    }
  });

  setTimeout(() => {
    breaker.fire(100)
      .catch(t.fail)
      .then(arg => t.equals(arg, 100, 'breaker has reset'))
      .then(_ => breaker.shutdown())
      .then(t.end);
  }, resetTimeout * 1.25);
});

test('Enters halfOpen state if closed is false and more time has elapsed since resetTimeout', t => {
  t.plan(2);
  const resetTimeout = 100;
  const breaker = new CircuitBreaker(passFail, {
    errorThresholdPercentage: 1,
    resetTimeout,
    state: {
      closed: false,
      lastTimerAt: Date.now() - (resetTimeout * 1.25)
    }
  });

  t.ok(breaker.halfOpen, 'breaker should be halfOpen');
  breaker.fire(100)
    .catch(t.fail)
    .then(arg => t.equals(arg, 100, 'breaker has reset'))
    .then(_ => breaker.shutdown())
    .then(t.end);
});

test('When half-open, the circuit only allows one request through', t => {
  t.plan(7);
  const options = {
    errorThresholdPercentage: 1,
    resetTimeout: 100,
    state: {
      closed: false,
      halfOpen: true
    }
  };

  const breaker = new CircuitBreaker(timedFailingFunction, options);
  t.ok(breaker.halfOpen, 'should be halfOpen on initialize');
  t.ok(breaker.pendingClose, 'should be pending close on initialize');

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

test('Circuit initialized as shutdown', t => {
  t.plan(5);
  const options = {
    state: {
      closed: false,
      open: false,
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

test('CircuitBreaker State - imports the state and status of a breaker instance', t => {
  const breaker = new CircuitBreaker(passFail);
  const exp = breaker.toJSON();
  const state = exp.state;
  const status = exp.status;
  const clone = new CircuitBreaker(passFail, { state, status });
  // test imported state
  for (const stat of ['enabled', 'closed', 'halfOpen', 'warmUp']) {
    t.equal(clone[status], state[status], `cloned breaker ${stat} state`);
  }
  t.equal(clone.opened, state.open, 'cloned breaker open state');
  t.equal(clone.isShutdown, state.shutdown, 'cloned breaker shutdown state');
  // test imported status
  const stats = clone.stats;
  for (const stat in stats) {
    t.equal(
      stats[stat].toString(),
      status[stat].toString(),
      `cloned stat ${stat} value`);
  }
  t.end();
});
