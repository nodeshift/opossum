'use strict';

const test = require('tape');
const CircuitBreaker = require('../');
const Status = require('../lib/status.js');
const { passFail } = require('./common');

test('CircuitBreaker status - new Status static method', t => {
  t.plan(9);

  const prevStats = {
    failures: 1,
    fallbacks: 1,
    successes: 1,
    rejects: 1,
    fires: 1,
    timeouts: 1,
    cacheHits: 1,
    cacheMisses: 1,
    semaphoreRejections: 1,
    percentiles: {},
    latencyTimes: []
  };

  const status = CircuitBreaker.newStatus({stats: prevStats});
  t.equal(status instanceof Status, true, 'returns a new Status instance');

  const stats = status.stats;
  t.equal(stats.failures, 1, 'status reports 1 failure');
  t.equal(stats.rejects, 1, 'status reports 1 reject');
  t.equal(stats.fires, 1, 'status reports 5 fires');
  t.equal(stats.fallbacks, 1, 'status reports 1 fallback');
  t.equal(stats.successes, 1, 'status reports 1 successes');
  t.equal(stats.timeouts, 1, 'status reports 1 timeouts');
  t.equal(stats.cacheHits, 1, 'status reports 1 cacheHits');
  t.equal(stats.semaphoreRejections, 1, 'status reports 1 semaphoreRejections');

  t.end();
});

test('CircuitBreaker status - import stats', t => {
  t.plan(12);

  const prevStats = {
    failures: 1,
    fallbacks: 1,
    successes: 1,
    rejects: 1,
    fires: 1,
    timeouts: 1,
    cacheHits: 1,
    cacheMisses: 1,
    semaphoreRejections: 1,
    percentiles: {},
    latencyTimes: []
  };

  const status = CircuitBreaker.newStatus({stats: prevStats});

  const breaker = new CircuitBreaker(passFail, {
    errorThresholdPercentage: 1,
    status: status
  });

  const deepEqual = (t, expected) =>
    actual => t.deepEqual(actual, expected, 'expected status values');

  Promise.all([
    breaker.fire(10).then(deepEqual(t, 10)),
    breaker.fire(20).then(deepEqual(t, 20)),
    breaker.fire(30).then(deepEqual(t, 30))
  ])
    .then(() => t.deepEqual(breaker.status.stats.fires, 4,
      'breaker fired 4 times'))
    .catch(t.fail)
    .then(() => {
      breaker.fire(-10)
        .then(t.fail)
        .catch(value => {
          const stats = breaker.status.stats;
          t.equal(value, 'Error: -10 is < 0',
            'fails with correct error message');
          t.equal(stats.failures, 2, 'status reports a single failure');
          t.equal(stats.fires, 5, 'status reports 4 fires');
        })
        .then(() => {
          breaker.fallback(() => 'Fallback called');
          return breaker.fire(-20)
            .then(result => {
              const stats = breaker.status.stats;
              t.equal(result, 'Fallback called', 'fallback is invoked');
              t.equal(stats.failures, 2, 'status reports 1 failure');
              t.equal(stats.rejects, 2, 'status reports 1 reject');
              t.equal(stats.fires, 6, 'status reports 5 fires');
              t.equal(stats.fallbacks, 2, 'status reports 1 fallback');
            })
            .catch(t.fail);
        })
        .then(_ => breaker.shutdown())
        .catch(t.fail)
        .then(t.end);
    });
});

test('CircuitBreaker status - import stats, but leave some out', t => {
  t.plan(3);

  const prevStats = {
    rejects: 1,
    fires: 1,
    timeouts: 1,
    cacheHits: 1,
    cacheMisses: 1,
    semaphoreRejections: 1,
    percentiles: {},
    latencyTimes: []
  };

  const status = CircuitBreaker.newStatus({stats: prevStats});

  const breaker = new CircuitBreaker(passFail, {
    errorThresholdPercentage: 1,
    status: status
  });

  t.equal(breaker.status.stats.failures, 0, 'failures was initialized');
  t.equal(breaker.status.stats.fallbacks, 0, 'fallbacks was initialized');
  t.equal(breaker.status.stats.successes, 0, 'successes was initialized');

  breaker.shutdown();
  t.end();
});

test('CircuitBreaker status - import stats,but not a status object', t => {
  t.plan(1);

  const prevStats = {
    rejects: 1,
    fires: 1,
    timeouts: 1,
    cacheHits: 1,
    cacheMisses: 1,
    semaphoreRejections: 1,
    percentiles: {},
    latencyTimes: []
  };

  try {
    // eslint-disable-next-line
    const _ = new CircuitBreaker(passFail, {
      errorThresholdPercentage: 1,
      status: prevStats
    });
    t.fail();
  } catch (err) {
    if (err instanceof TypeError) t.pass();
    t.end();
  }
});
